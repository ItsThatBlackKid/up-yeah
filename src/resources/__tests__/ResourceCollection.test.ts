import { Axios, AxiosInstance } from 'axios';
import { ResponseLinks } from '../../types';
import { mockUpAccountsResponse } from '../../__mocks__/accountData';
import mockAxios from '../../__mocks__/axios';
import { mockListTransactionsMultiResponse } from '../../__mocks__/transactionData';
import AccountResource from '../Account/AccountResource';
import ResourceCollection from '../Resource/ResourceCollection';
import TransactionResource from '../Transactions/TransactionResource';
import { AccountTypeEnum, OwnershipTypeEnum, TransactionStatusEnum } from '../types';

describe('ResourceLink', () => {
	it('should set prevLink and nextLink when constructed', () => {
		const resourceLinks: ResponseLinks = {
			prev: 'https://up.com.au/api/v1/accounts',
			next: 'https://up.com.au/api/v1/accounts',
		};
		const resourceLink = new ResourceCollection([], resourceLinks, mockAxios as unknown as AxiosInstance);

		expect(resourceLink.prevLink).toEqual('https://up.com.au/api/v1/accounts');
		expect(resourceLink.nextLink).toEqual('https://up.com.au/api/v1/accounts');
	});

	describe('next', () => {
		it('should return null if nextLink is null', async () => {
			const collection = new ResourceCollection<AccountResource>(
				[],
				{
					prev: 'http://some.up.au/api/v1/account/endpoint/1',
					next: null,
				},
				mockAxios as unknown as AxiosInstance,
			);

			expect(await collection.next()).toEqual(null);
		});

		it('should return undefined if returned resource array is empty', async () => {
			mockAxios.get.mockResolvedValue({
				data: {
					data: [],
				},
			});
			const collection = new ResourceCollection<AccountResource>(
				[],
				{
					prev: null,
					next: 'http://some.up.au/api/v1/account/endpoint/1',
				},
				mockAxios as unknown as AxiosInstance,
			);

			expect(await collection.next()).toEqual(null);
		});
		it('should return next set of account resources if available', async () => {
			mockAxios.get.mockResolvedValue({
				data: mockUpAccountsResponse,
			});

			const collection = new ResourceCollection<AccountResource>(
				[],
				{
					prev: null,
					next: 'http://some.up.au/api/v1/account/endpoint/1',
				},
				mockAxios as unknown as Axios,
			);

			await collection.next();

			const expectedAccountResource = new AccountResource(
				'mockId',
				{
					displayName: 'up-yeah',
					accountType: AccountTypeEnum.TRANSACTIONAL,
					balance: {
						currencyCode: 'AUD',
						value: '4.20',
						valueInBaseUnits: 420,
					},
					createdAt: new Date('2021-09-23T01:12:00+10:00'),
					ownershipType: OwnershipTypeEnum.INDIVIDUAL,
				},
				{
					transactions: {
						data: [],
					},
				},
			);

			const expectedAccountResource2 = new AccountResource(
				'mockId2',
				{
					displayName: '2Up',
					accountType: AccountTypeEnum.TRANSACTIONAL,
					balance: {
						currencyCode: 'AUD',
						value: '4.20',
						valueInBaseUnits: 420,
					},
					createdAt: new Date('2021-09-23T01:12:00+10:00'),
					ownershipType: OwnershipTypeEnum.JOINT,
				},
				{
					transactions: {
						data: [],
					},
				},
			);

			//see the jest issue #8475: https://github.com/jestjs/jest/issues/8475
			expect(JSON.stringify(collection.resources)).toEqual(
				JSON.stringify([expectedAccountResource, expectedAccountResource2]),
			);
		});

		it('should return next set of transaction resources if available', async () => {
			mockAxios.get.mockResolvedValue(mockListTransactionsMultiResponse);

			const collection = new ResourceCollection<TransactionResource>(
				[],
				{
					prev: null,
					next: 'http://some.up.au/api/v1/transaction/endpoint/1',
				},
				mockAxios as unknown as AxiosInstance,
			);

			await collection.next();

			const expectedTransactions = [
				expect.objectContaining({
					amount: {
						currencyCode: 'AUD',
						value: '4.20',
						valueInBaseUnits: 420,
					},
					createdAt: new Date('2023-07-18T07:44:17+10:00'),
					description: 'This is a transaction',
					id: 'mockId',
					isCategorizable: false,
					relationships: {
						account: {},
					},
					type: 'transactions',
					status: TransactionStatusEnum.SETTLED,
				}),

				expect.objectContaining({
					amount: {
						currencyCode: 'AUD',
						value: '6.9',
						valueInBaseUnits: 690,
					},
					createdAt: new Date('2023-07-18T07:44:17+10:00'),
					description: 'This is another transaction',
					isCategorizable: false,
					status: TransactionStatusEnum.SETTLED,
					id: 'mockId',
					relationships: {
						account: {},
					},
					type: 'transactions',
				}),
			];

			expect(collection.resources).toEqual(expect.arrayContaining(expectedTransactions));
			expect(collection.nextLink).toEqual('http://some.up.au/api/v1/transaction/endpoint/2');
		});
	});
});
