import AccountResource from '../Account/AccountResource';
import TransactionResource from '../Transactions/TransactionResource';
import { Maybe, ResourceResponse, ResponseLinks} from '../../types';
import {AxiosInstance, AxiosResponse} from 'axios';
import {ErrorObject, GetAccountsResponse, ListTransactionResponse} from '../../client';
import {buildAccounts, buildTransactions} from '../../utils';
import UpError from '../../errors/UpError';
import UpErrorCollection from '../../errors/UpErrorCollection';
import Resource from './Resource';

interface IResourceLink<T extends Resource> {
    prev: () => Promise<Maybe<T[]>>;
    next: () => Promise<Maybe<T[]>>;
}
export default class ResourceCollection<T extends Resource> implements  IResourceLink<T>{
    private client: AxiosInstance
    prevLink: Maybe<string>
    nextLink: Maybe<string>
    resources: T[]
    constructor(resources: T[], links: ResponseLinks, client: AxiosInstance) {
        this.resources = resources;
        this.prevLink = links.prev;
        this.nextLink = links.next;
        this.client = client;
    }

    /**
     * Retrieves the previous resource.
     */
    public prev = async (): Promise<Maybe<T[]>> => {
       return this.handleLink(this.prevLink);
    }

    private nextAccount = (axiosResponse: AxiosResponse<GetAccountsResponse>): AccountResource[] => {
        return buildAccounts(axiosResponse.data.data);
    }

    private nextTransactions = (axiosResponse:  AxiosResponse<ListTransactionResponse>): TransactionResource[] => {
        return buildTransactions(axiosResponse.data.data);
    }

    public next = async (): Promise<Maybe<T[]>> => {
       return this.handleLink(this.nextLink);
    }

    private handleLink = async (linkURL: Maybe<string>) => {
        if(!linkURL) {
            return null;
        }

        let res;
        try {
            res = await this.client.get<ResourceResponse>(linkURL);
        } catch (e: any) {
            const errors: ErrorObject[] | undefined = e.response.data.errors;
            const collectedErrors: UpError[] = [];

            if (errors) {
                errors.forEach((err) => {
                    collectedErrors.push(new UpError(err.status, err.title, err.detail, err.source));
                });
            }

            throw new UpErrorCollection(collectedErrors);
        }
        if(!res.data.data || res.data.data.length === 0) {
            return null;
        }

        const {type} = res.data.data[0];

        if(!['accounts', 'transactions'].includes(type)) {
           return null;
        }

        this.nextLink = res.data.links.next;
        this.prevLink = res.data.links.prev;

        if(type === 'accounts') {
            this.resources = this.nextAccount(res as AxiosResponse<GetAccountsResponse>) as unknown as T[]
            return this.resources;
        }

        if(type === 'transactions') {
            this.resources = this.nextTransactions(res as AxiosResponse<ListTransactionResponse>) as unknown as T[];
            return this.resources;
        }
    }
}