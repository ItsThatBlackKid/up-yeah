import { mockListTransactionsMultiResponse, mockTransactionResponse } from '../../__mocks__/transactionData';
import { buildTransaction, buildTransactions } from '../buildResources';
import TransactionResource from '../../resources/Transactions/TransactionResource';
import { TransactionStatusEnum } from '../../resources/types';
import { Axios } from 'axios';
import AccountResource from '../../resources/Account/AccountResource';

describe('buildTransactions.ts', () => {
	it('should build transaction resource', () => {
		const transaction = buildTransaction(mockTransactionResponse);
		const expectedTransaction: TransactionResource = new TransactionResource(
			'mockId',
			{
				amount: {
				currencyCode: 'AUD',
				value: '4.20',
				valueInBaseUnits: 420,
			},
			createdAt: new Date('2023-07-18T07:44:17+10:00'),
			description: 'This is a transaction',
			isCategorizable: false,
			status: TransactionStatusEnum.SETTLED,
			},
			{
				account: {}
			}
		)

		expect(transaction).toEqual(expectedTransaction);
	});

	it('should build all transactions in the array', () => {
		const transactions = buildTransactions(mockListTransactionsMultiResponse.data.data);

		const expectedTransactions = [
			new TransactionResource(
				'mockId',
				{
					amount: {
					currencyCode: 'AUD',
					value: '4.20',
					valueInBaseUnits: 420,
				},
					createdAt: new Date('2023-07-18T07:44:17+10:00'),
				description: 'This is a transaction',
				status: TransactionStatusEnum.SETTLED,
				isCategorizable: false
				},
				 {
					account: {},
				},
			),

			new TransactionResource(
				'mockId',
				{
					amount: {
					currencyCode: 'AUD',
					value: '6.9',
					valueInBaseUnits: 690,
				},
					createdAt: new Date('2023-07-18T07:44:17+10:00'),
				description: 'This is another transaction',
				status: TransactionStatusEnum.SETTLED,
				isCategorizable: false
				},
				 {
					account: {},
				},
			),
		];

		expect(transactions).toEqual(expectedTransactions);
	});
});
