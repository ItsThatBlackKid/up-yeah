import mockAxios from 'jest-mock-axios';
import UpClient from './UpClient';
import AccountResource from '../resources/AccountResource';
import {OwnershipTypeEnum} from '../resources/types';
import {GetAccountsQueryOptions} from "./types";

const mockUpAccountsResponse = {
    data: {
        data: [{
            type: 'accounts',
            id: 'mockId',
            attributes: {
                displayName: 'up-yeah',
                accountType: 'TRANSACTIONAL',
                ownershipType: 'INDIVIDUAL',
                balance: {
                    currencyCode: 'AUD',
                    value: '4.20',
                    valueInBaseUnits: 420
                },
                createdAt: '2021-09-23T01:12:00+10:00'
            },
            relationships: {
                transactions: {}
            }
        }]
    },
    links: {
        prev: null,
        next: null
    }
};

const mockGetAccountResponse = {
    data: {
        data: {
            type: 'accounts',
            id: 'mockId',
            attributes: {
                displayName: 'up-yeah',
                accountType: 'TRANSACTIONAL',
                ownershipType: 'INDIVIDUAL',
                balance: {
                    currencyCode: 'AUD',
                    value: '4.20',
                    valueInBaseUnits: 420
                },
                createdAt: '2021-09-23T01:12:00+10:00'
            },
            relationships: {
                transactions: {}
            }
        }
    }
}


describe('Up Client', () => {
    it('should create axios instance with correct options', () => {
        // tslint:disable-next-line:no-unused-expression
        new UpClient({
            personalAccessToken: 'xyz',
        });
        expect(mockAxios.create).toHaveBeenCalledWith({
            baseURL: 'https://api.up.com.au/api/v1',
            headers: {
                Authorization: `Bearer  xyz`,
            },
        });
    });

    describe('getAccounts', () => {
        it('should make GET call to /accounts when invoked', async () => {
            mockAxios.get.mockResolvedValue({
                data: {
                    data: []
                }
            });

            const client = new UpClient({
                personalAccessToken: 'xyz'
            });

            await client.getAccounts();

            expect(mockAxios.get).toHaveBeenCalledWith('/accounts');
        });

        it('should return accounts found in response data', async () => {
            mockAxios.get.mockResolvedValue(mockUpAccountsResponse);

            const client = new UpClient({
                personalAccessToken: 'xyz'
            });

            const accounts = await client.getAccounts();

            const expectedAccountResource = new AccountResource('mockId', {
                displayName: 'up-yeah',
                accountType: 'TRANSACTIONAL',
                balance: {
                    currencyCode: 'AUD',
                    value: '4.20',
                    valueInBaseUnits: 420
                },
                createdAt: new Date('2021-09-23T01:12:00+10:00'),
                ownershipType: OwnershipTypeEnum.INDIVIDUAL
            }, {
                transactions: {}
            });

            expect(accounts[0]).toEqual(expectedAccountResource);
        });
        it('should pass query params to get call', async () => {
            mockAxios.get.mockResolvedValue(mockUpAccountsResponse);

            const client = new UpClient({
                personalAccessToken: 'xyz'
            });

            const options: GetAccountsQueryOptions = {
                pageSize: 10,
                filterAccType: 'SAVER',
                filterAccOwnershipType: OwnershipTypeEnum.INDIVIDUAL
            }

            await client.getAccounts(options);

            expect(mockAxios.get).toHaveBeenCalledWith('/accounts', {
                params: {
                    'page[size]': options.pageSize,
                    'filter[accountType]': options.filterAccType,
                    'filter[ownershipType]': options.filterAccOwnershipType
                }
            })
        })

        it('should pass defined options to get call', async () => {
            mockAxios.get.mockResolvedValue(mockUpAccountsResponse);

            const client = new UpClient({
                personalAccessToken: 'xyz'
            });

            const options: GetAccountsQueryOptions = {
                pageSize: 10,
                // filterAccType: 'SAVER',
                // filterAccOwnershipType: OwnershipTypeEnum.INDIVIDUAL
            }

            await client.getAccounts(options);
            expect(mockAxios.get).toHaveBeenCalledWith('/accounts', {
                params: {
                    'page[size]': options.pageSize,
                }
            })
        })
    });

    describe('getAccount', () => {
        it('should return account with matching ID', async () => {
            mockAxios.get.mockResolvedValue(mockGetAccountResponse)

            const client = new UpClient({
                personalAccessToken: 'xyz'
            });

            const account: AccountResource | undefined = await client.getAccount('mockId');
            const expectedAccountResource = new AccountResource('mockId', {
                displayName: 'up-yeah',
                accountType: 'TRANSACTIONAL',
                balance: {
                    currencyCode: 'AUD',
                    value: '4.20',
                    valueInBaseUnits: 420
                },
                createdAt: new Date('2021-09-23T01:12:00+10:00'),
                ownershipType: OwnershipTypeEnum.INDIVIDUAL
            }, {
                transactions: {}
            });

            expect(account).toEqual(expectedAccountResource);
        })
    })
});
