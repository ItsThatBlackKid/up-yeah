import mockAxios from 'jest-mock-axios';
import { IUpError } from '../../errors';
import UpErrorCollection from '../../errors/UpErrorCollection';
import AccountResource from '../../resources/Account/AccountResource';
import CategoryResource from '../../resources/Categories/CategoryResource';
import TagResource from '../../resources/Tags/TagResource';
import TransactionResource from '../../resources/Transactions/TransactionResource';
import { AccountTypeEnum, OwnershipTypeEnum, TransactionStatusEnum } from '../../resources/types';
import { mockGetAccountResponse, mockUpAccountsResponse, mockUpListAccountsEmpty } from '../../__mocks__/accountData';
import { mockGetCategoriesResponse } from '../../__mocks__/categoryData';
import { mockTagPayload, mockTagRelationships, mockTagsResponse } from '../../__mocks__/tagData';
import { mockListTransactionsResponse, mockUpGetTransactionsEmpty } from '../../__mocks__/transactionData';
import { GetAccountsQueryOptions, GetTransactionsQueryOptions, PostTagPayload, TransactionStatus } from '../types';
import UpClient from '../UpClient';

let client: UpClient;
describe('Up Client', () => {
	beforeEach(() => {
		client = new UpClient({
			personalAccessToken: 'xyz',
		});
	});
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

	describe('Account', () => {
		describe('getAccounts', () => {
			it('should make GET call to /accounts when invoked', async () => {
				mockAxios.get.mockResolvedValue(mockUpListAccountsEmpty);

				await client.getAccounts();

				expect(mockAxios.get).toHaveBeenCalledWith('/accounts');
			});

			it('should return accounts found in response data', async () => {
				mockAxios.get.mockResolvedValue({ data: mockUpAccountsResponse });

				const accounts = await client.getAccounts();

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

				expect(accounts.resources[0]).toEqual(expectedAccountResource);
			});

			it('should pass query params to get call', async () => {
				mockAxios.get.mockResolvedValue(mockUpListAccountsEmpty);

				const options: GetAccountsQueryOptions = {
					pageSize: 10,
					filterAccType: AccountTypeEnum.SAVER,
					filterAccOwnershipType: OwnershipTypeEnum.INDIVIDUAL,
				};

				await client.getAccounts(options);

				expect(mockAxios.get).toHaveBeenCalledWith('/accounts', {
					params: {
						'page[size]': options.pageSize,
						'filter[accountType]': options.filterAccType,
						'filter[ownershipType]': options.filterAccOwnershipType,
					},
				});
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
				};
				mockAxios.get.mockRejectedValue({
					response: {
						data: {
							errors: [mockUpError],
						},
					},
				});

				await expect(async () => {
					await client.getAccounts();
				}).rejects.toThrow(new UpErrorCollection([mockUpError]));
			});
		});

		describe('getAccount', () => {
			it('should make GET call to /account/{id} when invoked', async () => {
				mockAxios.get.mockResolvedValue(mockGetAccountResponse);

				await client.getAccount('mockId');

				expect(mockAxios.get).toHaveBeenCalledWith('/account/mockId');
			});

			it('should return account with matching ID', async () => {
				mockAxios.get.mockResolvedValue(mockGetAccountResponse);

				const account: AccountResource | undefined = await client.getAccount('mockId');
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
				};
				mockAxios.get.mockRejectedValue({
					response: {
						data: {
							errors: [mockUpError],
						},
					},
				});

				await expect(async () => {
					await client.getAccount('mockId');
				}).rejects.toThrow(new UpErrorCollection([mockUpError]));
			});
		});
	});

	describe('Transactions', () => {
		describe('getTransactions', () => {
			it('should make GET call to /transactions when invoked', async () => {
				mockAxios.get.mockResolvedValue(mockListTransactionsResponse);

				await client.getTransactions();

				expect(mockAxios.get).toHaveBeenCalledWith('/transactions');
			});

			it('should return transactions in response', async () => {
				mockAxios.get.mockResolvedValue(mockListTransactionsResponse);

				const expectedTransaction: TransactionResource = {
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
				};

				const transactions = await client.getTransactions();

				expect(transactions.resources).toEqual(expect.arrayContaining([expectedTransaction]));
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
				};
				mockAxios.get.mockRejectedValue({
					response: {
						data: {
							errors: [mockUpError],
						},
					},
				});

				await expect(async () => {
					await client.getTransactions();
				}).rejects.toThrow(new UpErrorCollection([mockUpError]));
			});

			it('should pass query params to get call', async () => {
				mockAxios.get.mockResolvedValue(mockUpGetTransactionsEmpty);

				const options: GetTransactionsQueryOptions = {
					pageSize: 10,
					filterStatus: TransactionStatus.HELD,
					filterSince: '2020-01-01T01:02:03+10:00',
					filterUntil: '2023-01-01T01:02:03+10:00',
					filterCategory: 'good-life',
					filterTag: 'Holiday',
				};

				await client.getTransactions(options);
				expect(mockAxios.get).toHaveBeenCalledWith('/transactions', {
					params: {
						'page[size]': options.pageSize,
						'filter[status]': options.filterStatus,
						'filter[since]': options.filterSince,
						'filter[until]': options.filterUntil,
						'filter[category]': options.filterCategory,
						'filter[tag]': options.filterTag,
					},
				});
			});
		});
		describe('getTransactionsByAccount', () => {
			it('should make GET call to /accounts/{accountId}/transactions', async () => {
				mockAxios.get.mockResolvedValue(mockListTransactionsResponse);
				const expectedTransaction: TransactionResource = {
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
				};

				const transactions = await client.getTransactionsByAccount('xyz');
				expect(transactions.resources).toEqual(expect.arrayContaining([expectedTransaction]));
			})
		})
	});

	describe('Categories', () => {
		describe('getCategories', () => {
			it('should invoke axios get', async () => {
				mockAxios.get.mockResolvedValue({
					data: {
						data: [],
					},
				});

				await client.getCategories();

				expect(mockAxios.get).toHaveBeenCalledWith('/categories');
			});
			it('should return a collection of all categories if successful', async () => {
				mockAxios.get.mockResolvedValue({
					data: mockGetCategoriesResponse,
				});

				const expectedCategories: CategoryResource[] = [
					{
						id: 'hobbies',
						type: 'categories',
						attributes: {
							name: 'Hobbies',
						},
						relationships: {
							parent: {
								data: {
									id: 'good-life',
									type: 'categories',
								},
								links: {
									related: 'https://somegood.life/api/v1/etc',
								},
							},
							children: {
								data: [],
							},
						},
					},
					{
						id: 'good-life',
						type: 'categories',
						attributes: {
							name: 'Good Life',
						},
						relationships: {
							parent: {},
							children: {
								data: [],
							},
						},
					},
				];

				const categories = await client.getCategories();

				expect(categories.resources).toEqual(expect.arrayContaining(expectedCategories));
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
				};
				mockAxios.get.mockRejectedValue({
					response: {
						data: {
							errors: [mockUpError],
						},
					},
				});

				await expect(async () => {
					await client.getCategories();
				}).rejects.toThrow(new UpErrorCollection([mockUpError]));
			});
		});
		describe('getCategory', () => {
			it('should make GET call to /categories/{id}', async () => {
				mockAxios.get.mockResolvedValue({
					data: {
						data: mockGetCategoriesResponse.data[0],
					},
				});

				await client.getCategory('good-life');

				expect(mockAxios.get).toHaveBeenCalledWith('/categories/good-life');
			});

			it('should build return CategoryResource on success', async () => {
				mockAxios.get.mockResolvedValue({
					data: {
						data: mockGetCategoriesResponse.data[0],
					},
				});

				const category = await client.getCategory('good-life');
				const expectedCategory: CategoryResource = {
					id: 'hobbies',
					type: 'categories',
					attributes: {
						name: 'Hobbies',
					},
					relationships: {
						parent: {
							data: {
								id: 'good-life',
								type: 'categories',
							},
							links: {
								related: 'https://somegood.life/api/v1/etc',
							},
						},
						children: {
							data: [],
						},
					},
				};

				expect(category).toEqual(expectedCategory);
			});

			it('should throw UpError if api returns an error', async () => {
				const mockUpError: IUpError = {
					status: '404',
					title: 'Bad request',
					detail: 'Some of the information provided is invalid',
					source: {
						parameter: 'x',
						pointer: '0',
					},
				};
				mockAxios.get.mockRejectedValue({
					response: {
						data: {
							errors: [mockUpError],
						},
					},
				});

				await expect(async () => {
					await client.getCategory('good-bye');
				}).rejects.toThrow(new UpErrorCollection([mockUpError]));
			});
		});
	});

	describe('Tags', () => {
		describe('getTags', () => {
			it('should make GET call to /tags', async () => {
				mockAxios.get.mockResolvedValue({
					data: {
						data: [],
						links: {
							prev: null,
							next: null,
						},
					},
				});

				await client.getTags();
				expect(mockAxios.get).toHaveBeenCalledWith('/tags');
			});

			it('should return a collection of tags', async () => {
				mockAxios.get.mockResolvedValue({ data: mockTagsResponse });

				const expectedTags: TagResource[] = [
					{
						type: 'tags',
						id: 'Pizza Night',
						relationships: mockTagRelationships,
					},
					{
						type: 'tags',
						id: 'Holiday',
						relationships: {
							transactions: null,
						},
					},
				];

				const tags = await client.getTags();

				expect(tags.resources).toEqual(expect.arrayContaining(expectedTags));
			});

			it('should throw UpErrorCollection if api returns an error', async () => {
				const mockUpError: IUpError = {
					status: '400',
					title: 'Bad request',
					detail: 'Some of the information provided is invalid',
					source: {
						parameter: 'x',
						pointer: '0',
					},
				};
				mockAxios.get.mockRejectedValue({
					response: {
						data: {
							errors: [mockUpError],
						},
					},
				});

				await expect(async () => {
					await client.getTags();
				}).rejects.toThrow(new UpErrorCollection([mockUpError]));
			});
		});

		describe('addTagToTransaction', () => {
			it('should make POST call to /transactions/{transactionId}/relationships/tags', async () => {
				mockAxios.post.mockResolvedValue({
					status: 204
				});
				await client.addTagsToTransaction('xyz', [
					mockTagPayload,
					{
						type: 'tags',
						id: 'fishing',
					},
				]);

				expect(mockAxios.post).toHaveBeenCalledWith('/transactions/xyz/relationships/tags', {
					data: [
						mockTagPayload,
						{
							type: 'tags',
							id: 'fishing',
						},
					],
				});
			});

			it('should return true on success', async () => {
				mockAxios.post.mockResolvedValue({
					status: 204
				});

				const val = await client.addTagsToTransaction('xyz', [
					mockTagPayload,
					{
						type: 'tags',
						id: 'fishing',
					},
				]);

				expect(val).toEqual(true);
			});

			it('should return false if receive status other than 204', async () => {
				mockAxios.post.mockResolvedValue({
					status: 200
				});

				const val = await client.addTagsToTransaction('xyz', [
					mockTagPayload,
					{
						type: 'tags',
						id: 'fishing',
					},
				]);

				expect(val).toEqual(false);
			})

			it('should throw UpErrorCollection if api returns an error', async () => {
				const mockUpError: IUpError = {
					status: '400',
					title: 'Bad request',
					detail: 'Some of the information provided is invalid',
					source: {
						parameter: 'x',
						pointer: '0',
					},
				};
				mockAxios.post.mockRejectedValue({
					response: {
						data: {
							errors: [mockUpError],
						},
					},
				});

				await expect(async () => {
					await client.addTagsToTransaction('xyz', []);
				}).rejects.toThrow(new UpErrorCollection([mockUpError]));
			});
		});

		describe('removeTagsFromTransaction', () => {
			it('should make delete call to /transactions/{transactionId}/relationships/tags', async () => {
				mockAxios.delete.mockResolvedValue({
					status: 200
				});
				const payload: PostTagPayload[] = [
					mockTagPayload,
					{
						type: 'tags',
						id: 'fishing',
					},
				];
				await client.removeTagsFromTransaction('xyz', payload);

				expect(mockAxios.delete).toHaveBeenCalledWith('/transactions/xyz/relationships/tags', expect.objectContaining({
					data: expect.objectContaining({
						data: payload
					}),
				}));
			});

			it('should return true on success', async () => {
				mockAxios.delete.mockResolvedValue({
					status: 204
				});

				const val = await client.removeTagsFromTransaction('xyz', [
					mockTagPayload,
					{
						type: 'tags',
						id: 'fishing',
					},
				]);

				expect(val).toEqual(true);
			});

			it('should return false if receive status other than 204', async () => {
				mockAxios.delete.mockResolvedValue({
					status: 200
				});

				const val = await client.removeTagsFromTransaction('xyz', [
					mockTagPayload,
					{
						type: 'tags',
						id: 'fishing',
					},
				]);

				expect(val).toEqual(false);
			})

			it('should throw UpErrorCollection if api returns an error', async () => {
				const mockUpError: IUpError = {
					status: '400',
					title: 'Bad request',
					detail: 'Some of the information provided is invalid',
					source: {
						parameter: 'x',
						pointer: '0',
					},
				};
				mockAxios.delete.mockRejectedValue({
					response: {
						data: {
							errors: [mockUpError],
						},
					},
				});

				await expect(async () => {
					await client.removeTagsFromTransaction('xyz', []);
				}).rejects.toThrow(new UpErrorCollection([mockUpError]));
			});


		});
	});
});
