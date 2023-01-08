/**
 * Created: 07/01/2023
 * Axios client to handle HTTP requests to the Up API
 */

import axios, {AxiosInstance} from 'axios';
import AccountResource from '../resources/AccountResource';
import {AccountResponse, UpClientOptions} from './types';
import {OwnershipTypeEnum} from "../resources/types";

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

    async getAccounts(): Promise<AccountResource[]> {
        try {
            const reqData = await this.clientInstance.get<AccountResponse>('/accounts');
            const responseData = reqData.data;
            const accounts = responseData.data;
            const accountResources: AccountResource[] = [];

            accounts.forEach(account => {
                const ownerShipType = account.attributes.ownershipType === "INDIVIDUAL" ? OwnershipTypeEnum.INDIVIDUAL : OwnershipTypeEnum.JOINT
                const acc = new AccountResource(account.id, {
                    accountType: account.type,
                    balance: account.attributes.balance,
                    createdAt: new Date(account.attributes.createdAt),
                    displayName: account.attributes.displayName,
                    ownershipType: ownerShipType,
                }, account.relationships);

                accountResources.push(acc);
            })


            return accountResources;
        } catch (e: any) {
            // tslint:disable-next-line:no-console
            console.log(e.response.data);
            return [];
        }
    }
}

export default UpClient;
