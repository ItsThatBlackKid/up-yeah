/**
 * Created: 07/01/2023
 * Axios client to handle HTTP requests to the Up API
 */

import axios, {AxiosInstance, AxiosResponse} from 'axios';
import AccountResource from '../resources/AccountResource';
import {GetAccountResponse, GetAccountsQueryOptions, GetAccountsResponse, UpClientOptions, ErrorObject} from './types';
import {OwnershipTypeEnum} from "../resources/types";
import UpError from '../errors/UpError';
import UpErrorCollection from '../errors/UpErrorCollection';


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

    async getAccounts(options?: GetAccountsQueryOptions): Promise<AccountResource[]> {
        try {
            let reqData: AxiosResponse<GetAccountsResponse> | undefined;

            if (options) {
                let params = {}
                if (options.pageSize) {
                    params = {
                        'page[size]': options.pageSize
                    }
                }

                if (options.filterAccOwnershipType) {
                    params = {
                        ...params,
                        'filter[accountType]': options.filterAccType
                    }
                }

                if(options.filterAccType) {
                    params = {
                        ...params,
                        'filter[ownershipType]': options.filterAccOwnershipType
                    }
                }

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
      const errors: ErrorObject[] = e.response.data.errors;
      const collectedErrors: UpError[] = [];
      errors.forEach((err) => {
        collectedErrors.push(new UpError(err.status, err.title, err.detail, err.source));
      });

      throw new UpErrorCollection(collectedErrors);
    }
  }

    async getAccount(id: string): Promise<AccountResource | undefined> {

        try {
            const data = (await this.clientInstance.get<GetAccountResponse>(`/account/${id}`)).data;
            const account = data.data;
            const ownerShipType: OwnershipTypeEnum = account.attributes.ownershipType as OwnershipTypeEnum;

            return new AccountResource(account.id,
                {
                    accountType: account.attributes.accountType,
                    balance: account.attributes.balance,
                    createdAt: new Date(account.attributes.createdAt),
                    displayName: account.attributes.displayName,
                    ownershipType: ownerShipType,
                },
                account.relationships
            );
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.log(e);
            return undefined
        }

    }
}

export default UpClient;
