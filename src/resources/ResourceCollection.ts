import AccountResource from './Account/AccountResource';
import TransactionResource from './TransactionResource';
import {Maybe, ResourceResponse, ResponseLinks} from '../types';
import {AxiosInstance, AxiosResponse} from 'axios';
import {AccountResourceResponse, ErrorObject, GetAccountsResponse, ListTransactionResponse} from '../client/types';
import {buildAccounts} from '../utils/buildAccounts';
import resource from './Resource';
import UpError from '../errors/UpError';
import UpErrorCollection from '../errors/UpErrorCollection';

interface IResourceLink<T extends AccountResource | TransactionResource> {
    prev: () => Promise<Maybe<T[]>>;
    next: () => Promise<Maybe<T[]>>;
}
export default class ResourceCollection<T extends AccountResource | TransactionResource> implements  IResourceLink<T>{
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
        if(!this.prevLink) {
            return null;
        }

        const res = await this.client.get<T>(this.prevLink);

        return undefined;
    }

    private nextAccount = (axiosResponse: AxiosResponse<GetAccountsResponse>): AccountResource[] => {
        return buildAccounts(axiosResponse.data.data);
    }

    public next = async (): Promise<Maybe<T[]>> => {
        if(!this.nextLink) {
            return null;
        }

        let res;
        try {
            res = await this.client.get<ResourceResponse>(this.nextLink);
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
        const {type} = res.data.data[0];

        this.nextLink = res.data.links.next;
        this.prevLink = res.data.links.prev;

        if(type === 'accounts') {
            this.resources = this.nextAccount(res as AxiosResponse<GetAccountsResponse>) as unknown as T[]

            return this.resources;
        }

        return undefined;
    }
}