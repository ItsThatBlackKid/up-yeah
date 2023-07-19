import mockAxios from 'jest-mock-axios';
import UpClient from '../UpClient';
import AccountResource from '../../resources/AccountResource';
import {AccountTypeEnum, OwnershipTypeEnum, TransactionStatusEnum} from '../../resources/types';
import {IUpError} from '../../errors/UpError';
import UpErrorCollection from "../../errors/UpErrorCollection";
import {
    GetAccountsQueryOptions,
    TransactionAttributesResponse,
    TransactionResponse
} from "../types";
import TransactionResource from "../../resources/TransactionResource";

const mockUpListAccountsEmpty = {
    data: {
        data: [],
    },
}

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
                transactions: {
                    data: []
                }
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
                transactions: {
                    data: []
                }
            }
        }
    }
}

const mockTransactionAttributes: TransactionAttributesResponse = {
    amount: {
        currencyCode: 'AUD',
        value: '4.20',
        valueInBaseUnits: 420
    },
    createdAt: '2023-07-18T07:44:17+10:00',
    description: "This is a transaction",
    isCategorizable: false,
    status: TransactionStatusEnum.SETTLED

}

const mockTransactionResponse: TransactionResponse = {
    attributes: mockTransactionAttributes,
    id: "mockId",
    links: {},
    relationships: {
        account: {}
    },
    type: "transactions"
}

const mockListTransactionsResponse = {
    data: {
        data:  [mockTransactionResponse]
    },
    links: {
        prev: null,
        next: null
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

    describe('Accounts', () => {
        describe('getAccounts', () => {
            it('should make GET call to /accounts when invoked', async () => {
                mockAxios.get.mockResolvedValue(mockUpListAccountsEmpty);

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
                    accountType: AccountTypeEnum.TRANSACTIONAL,
                    balance: {
                        currencyCode: 'AUD',
                        value: '4.20',
                        valueInBaseUnits: 420
                    },
                    createdAt: new Date('2021-09-23T01:12:00+10:00'),
                    ownershipType: OwnershipTypeEnum.INDIVIDUAL
                }, {
                    transactions: {
                        data: []
                    }
                });

                expect(accounts[0]).toEqual(expectedAccountResource);
            });

            it('should pass query params to get call', async () => {
                mockAxios.get.mockResolvedValue(mockUpListAccountsEmpty);

                const client = new UpClient({
                    personalAccessToken: 'xyz'
                });

                const options: GetAccountsQueryOptions = {
                    pageSize: 10,
                    filterAccType: AccountTypeEnum.SAVER,
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

            it('should throw UpError if api returns an error', async () => {
                const mockUpError: IUpError = {
                    status: '400',
                    title: 'Bad request',
                    detail: 'Some of the information provided is invalid',
                    source: {
                        parameter: 'x',
                        pointer: '0',
                    },
                }
                mockAxios.get.mockRejectedValue({
                    response: {
                        data: {
                            errors: [mockUpError]
                        },
                    },
                });

                const client = new UpClient({
                    personalAccessToken: 'xyz',
                });


                await expect(async () => {
                    await client.getAccounts();
                }).rejects.toThrow(new UpErrorCollection([mockUpError]));

            });

        });

        describe('getAccount', () => {
            it('should make GET call to /account/{id} when invoked', async () => {
                mockAxios.get.mockResolvedValue(mockGetAccountResponse);

                const client = new UpClient({
                    personalAccessToken: 'xyz'
                });

                await client.getAccount('mockId');

                expect(mockAxios.get).toHaveBeenCalledWith('/account/mockId');
            });

            it('should return account with matching ID', async () => {
                mockAxios.get.mockResolvedValue(mockGetAccountResponse)

                const client = new UpClient({
                    personalAccessToken: 'xyz'
                });

                const account: AccountResource | undefined = await client.getAccount('mockId');
                const expectedAccountResource = new AccountResource('mockId', {
                    displayName: 'up-yeah',
                    accountType: AccountTypeEnum.TRANSACTIONAL,
                    balance: {
                        currencyCode: 'AUD',
                        value: '4.20',
                        valueInBaseUnits: 420
                    },
                    createdAt: new Date('2021-09-23T01:12:00+10:00'),
                    ownershipType: OwnershipTypeEnum.INDIVIDUAL
                }, {
                    transactions: {
                        data: []
                    }
                });

                expect(account).toEqual(expectedAccountResource);
            });

            it('should throw UpError if api returns an error', async () => {
                const mockUpError: IUpError = {
                    status: '400',
                    title: 'Bad request',
                    detail: 'Some of the information provided is invalid',
                    source: {
                        parameter: 'x',
                        pointer: '0',
                    },
                }
                mockAxios.get.mockRejectedValue({
                    response: {
                        data: {
                            errors: [mockUpError]
                        },
                    },
                });

                const client = new UpClient({
                    personalAccessToken: 'xyz',
                });


                await expect(async () => {
                    await client.getAccount('mockId');
                }).rejects.toThrow(new UpErrorCollection([mockUpError]));
            });

        });
    })


    describe('Transactions', () => {
        describe('listAccounts', () => {
            it('should make GET call to /transactions when invoked', async () => {
                mockAxios.get.mockResolvedValue(mockListTransactionsResponse);

                const client = new UpClient({
                    personalAccessToken: 'xyz'
                });

                await client.listTransactions();

                expect(mockAxios.get).toHaveBeenCalledWith('/transactions');
            });

            it('should return transactions in response', async () => {
                mockAxios.get.mockResolvedValue(mockListTransactionsResponse);

                const client = new UpClient({
                    personalAccessToken: 'xyz'
                });

                const expectedTransaction: TransactionResource = {
                    amount: {
                        currencyCode: 'AUD',
                        value: '4.20',
                        valueInBaseUnits: 420
                    },
                    createdAt: new Date("2023-07-18T07:44:17+10:00"),
                    description: "This is a transaction",
                    id: "mockId",
                    isCategorizable: false,
                    relationships: {
                        account: {}
                    },
                    resourceType: "transactions",
                    status: TransactionStatusEnum.SETTLED
                }

                const transactions = await client.listTransactions();

                expect(transactions).toEqual(expect.arrayContaining([expectedTransaction]));
            });

            it('should throw UpErrorCollection if API errors', async () => {
                const mockUpError: IUpError = {
                    status: '400',
                    title: 'Bad request',
                    detail: 'Some of the information provided is invalid',
                    source: {
                        parameter: 'x',
                        pointer: '0',
                    },
                }
                mockAxios.get.mockRejectedValue({
                    response: {
                        data: {
                            errors: [mockUpError]
                        },
                    },
                });

                const client = new UpClient({
                    personalAccessToken: 'xyz',
                });


                await expect(async () => {
                    await client.listTransactions();
                }).rejects.toThrow(new UpErrorCollection([mockUpError]));
            })
        });

    })
});
