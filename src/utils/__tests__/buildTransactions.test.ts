import {mockListTransactionsMultiResponse, mockTransactionResponse} from '../../__mocks__/transactionData';
import {buildTransaction, buildTransactions} from '../buildResources';
import TransactionResource from '../../resources/Transactions/TransactionResource';
import {TransactionStatusEnum} from '../../resources/types';

describe('buildTransactions.ts', () => {
    it('should build transaction resource', () => {
        const transaction = buildTransaction(mockTransactionResponse);
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
            type: "transactions",
            status: TransactionStatusEnum.SETTLED
        }

        expect(transaction).toEqual(expectedTransaction)
    });

    it('should build all transactions in the array', () => {
        const transactions = buildTransactions(mockListTransactionsMultiResponse.data.data);

        const expectedTransactions = [
            {
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
            },
            {
                amount: {
                    currencyCode: 'AUD',
                    value: '6.9',
                    valueInBaseUnits: 690
                },
                createdAt: new Date("2023-07-18T07:44:17+10:00"),
                description: "This is another transaction",
                isCategorizable: false,
                status: TransactionStatusEnum.SETTLED,
                id: "mockId",
                relationships: {
                    account: {}
                },
                resourceType: "transactions",
            }
        ]

        expect(transactions).toEqual(expect.arrayContaining(expectedTransactions));
    })
})