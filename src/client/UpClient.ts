/**
 * Created: 07/01/2023
 * Axios client to handle HTTP requests to the Up API
 */

import axios, {AxiosInstance, AxiosResponse} from 'axios';
import AccountResource from '../resources/AccountResource';
import {
    GetAccountResponse,
    GetAccountsQueryOptions,
    GetAccountsResponse,
    UpClientOptions,
    ErrorObject,
    ListTransactionResponse
} from './types';
import {AccountTypeEnum, OwnershipTypeEnum} from "../resources/types";
import UpError from '../errors/UpError';
import UpErrorCollection from '../errors/UpErrorCollection';
import TransactionResource from "../resources/TransactionResource";

interface GetAccountsQueryParams {
    'page[size]'?: number
    'filter[accountType]'?: AccountTypeEnum
    'filter[ownershipType]'?: OwnershipTypeEnum
}

class UpClient {
    private readonly clientInstance: AxiosInstance;

    /**
     * Creates axios client instance with relevant options to the Up API
     * @param options Options for the client
     */
    constructor(options: UpClientOptions) {
        this.clientInstance = axios.create({
            baseURL: 'https://api.up.com.au/api/v1',
            headers: {
                Authorization: `Bearer  ${options.personalAccessToken}`,
            },
        });
    }

    /**
     * Getter for the clientInstance property.
     */
    getClientInstance(): AxiosInstance {
        return this.clientInstance;
    }

    private buildQueryParams = (options?: GetAccountsQueryOptions): GetAccountsQueryParams | undefined => {
        if (!options) return undefined;

        const params: GetAccountsQueryParams = {};


        if (options.pageSize) {
            params["page[size]"] = options.pageSize
        }

        if (options.filterAccOwnershipType) {
            params["filter[ownershipType]"] = options.filterAccOwnershipType
        }

        if (options.filterAccType) {
            params["filter[accountType]"] = options.filterAccType;
        }

        return params;
    }

    private buildAndThrowErrors = (e: any) =>  {
        const errors: ErrorObject[] | undefined = e.response.data.errors;
        const collectedErrors: UpError[] = [];

        if (errors) {
            errors.forEach((err) => {
                collectedErrors.push(new UpError(err.status, err.title, err.detail, err.source));
            });
        }

        throw new UpErrorCollection(collectedErrors);
    }

    public getAccounts = async (options?: GetAccountsQueryOptions): Promise<AccountResource[]> => {
        try {
            let reqData: AxiosResponse<GetAccountsResponse> | undefined;

            const params = this.buildQueryParams(options);

            if (params) {
                reqData = await this.clientInstance.get<GetAccountsResponse>('/accounts', {
                    params
                });
            } else {
                reqData = await this.clientInstance.get<GetAccountsResponse>('/accounts');
            }

            const responseData = reqData.data;
            const accounts = responseData.data;
            const accountResources: AccountResource[] = [];

            accounts.forEach(account => {
                const ownerShipType: OwnershipTypeEnum = account.attributes.ownershipType as OwnershipTypeEnum
                const acc = new AccountResource(account.id, {
                    accountType: account.attributes.accountType,
                    balance: account.attributes.balance,
                    createdAt: new Date(account.attributes.createdAt),
                    displayName: account.attributes.displayName,
                    ownershipType: ownerShipType,
                }, account.relationships);

                accountResources.push(acc);
            })


            return accountResources;
        } catch (e: any) {
            throw this.buildAndThrowErrors(e);
        }
    }

    async getAccount(id: string): Promise<AccountResource | undefined> {

        try {
            const data = (await this.clientInstance.get<GetAccountResponse>(`/account/${id}`)).data;
            const account = data.data;
            const ownerShipType: OwnershipTypeEnum = account.attributes.ownershipType as OwnershipTypeEnum;

            return new AccountResource(account.id,
                {
                    accountType: account.attributes.accountType as AccountTypeEnum,
                    balance: account.attributes.balance,
                    createdAt: new Date(account.attributes.createdAt),
                    displayName: account.attributes.displayName,
                    ownershipType: ownerShipType,
                },
                account.relationships
            );
        } catch (e: any) {
            throw this.buildAndThrowErrors(e);
        }

    }

    public listTransactions = async (): Promise<TransactionResource[]> => {
        try {
            const listResponse = await this.clientInstance.get<ListTransactionResponse>('/transactions');
            const transactionData = listResponse.data;

            const transactionResource: TransactionResource[] = [];

            transactionData.data.forEach((transaction) => {
                const resource: TransactionResource = new TransactionResource(transaction.id, {
                    ...transaction.attributes,
                    createdAt: new Date(transaction.attributes.createdAt),
                    settledAt: !!transaction.attributes.settledAt ? new Date(transaction.attributes.settledAt) : undefined
                }, transaction.relationships);

                transactionResource.push(resource);
            })
            return transactionResource;
        } catch (e: any) {
            throw this.buildAndThrowErrors(e);
        }

    }
}

export default UpClient;
