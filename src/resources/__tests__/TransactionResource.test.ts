import { Axios } from 'axios';
import { mockAccountResponse } from '../../__mocks__/accountData';
import mockAxios from '../../__mocks__/axios';
import { IUpError } from '../../errors';
import UpErrorCollection from '../../errors/UpErrorCollection';
import TransactionResource from '../Transactions/TransactionResource';
import {
	TransactionAttributes,
	TransactionRelationships,
	TransactionStatusEnum,
} from '../types';
import AccountResource from '../Account/AccountResource';

const mockAttributes: TransactionAttributes = {
	amount: {
		currencyCode: 'AUD',
		value: '12',
		valueInBaseUnits: 1200,
	},
	createdAt: new Date(11122),
	description: 'This is a transaction',
	isCategorizable: false,
	status: TransactionStatusEnum.SETTLED,
};

const mockRelationShips: TransactionRelationships = {
	account: {
		data: {
			type: 'accounts',
			id: 'mock-id',
		},
		links: {
			related: 'http://some.up.au/api/v1/accounts/mock-id',
		},
	},
};
describe('TransactionResource', () => {
	it('should build TransactionResource correctly', () => {
		const transaction: TransactionResource = new TransactionResource(
			'1',
			mockAttributes,
			mockRelationShips,
		);

		expect(transaction.id).toEqual('1');
		expect(transaction.createdAt).toEqual(new Date(11122));
		expect(transaction.status).toEqual('SETTLED');
		expect(transaction.description).toEqual('This is a transaction');
		expect(transaction.isCategorizable).toEqual(false);
		expect(transaction.amount).toEqual({
			currencyCode: 'AUD',
			value: '12',
			valueInBaseUnits: 1200,
		});

		expect(transaction.relationships).toEqual(mockRelationShips);
		expect(transaction.type).toEqual('transactions');
	});

	describe('getAccount', () => {
		afterEach(() => {
			jest.resetAllMocks();
		});
		it('should get account from parent link when called', async () => {
			const transaction: TransactionResource = new TransactionResource(
				'1',
				mockAttributes,
				mockRelationShips,
			);

			transaction.setClient(mockAxios as unknown as Axios);

			mockAxios.get.mockResolvedValue({
				data: {
					data: [mockAccountResponse],
					links: {
						prev: null,
						next: null,
					},
				},
			});

			const account = await transaction.getAccount();

			expect(mockAxios.get).toHaveBeenCalledWith(
				'http://some.up.au/api/v1/accounts/mock-id',
				undefined,
			);
			expect(account).toBeInstanceOf(Array<AccountResource[]>);
		});

		it('throw error if no parent link', () => {
			const transaction: TransactionResource = new TransactionResource(
				'1',
				mockAttributes,
				{
					account: {
						...mockRelationShips.account,
						links: {
							related: undefined,
						},
					},
				},
			);

			transaction.setClient(mockAxios as unknown as Axios);

			expect(transaction.getAccount()).rejects.toThrow(
				new Error('No parent account found on transaction.'),
			);
		});

		it('should throw UpErrorCollection if up API errors out', () => {
			const transaction: TransactionResource = new TransactionResource(
				'1',
				mockAttributes,
				mockRelationShips,
			);

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

			transaction.setClient(mockAxios as unknown as Axios);

			expect(transaction.getAccount()).rejects.toThrow(
				new UpErrorCollection([mockUpError]),
			);
		});
	});

	describe('categorizeTransaction', () => {
		const transaction: TransactionResource = new TransactionResource(
			'1',
			mockAttributes,
			mockRelationShips,
		);

		beforeEach(() => {
			transaction.setClient(mockAxios as unknown as Axios);
		});

		describe('categorizeTransaction', () => {
			it('should make PATCH call to /transactions/{transactionId}/relationships/category', async () => {
				mockAxios.patch.mockResolvedValue({ status: 204 });
				await transaction.categorizeTransaction(
					'mock-id',
					'restaurants-and-cafes',
				);

				expect(mockAxios.patch).toHaveBeenCalledWith(
					'/transactions/mock-id/relationships/category',
					{
						data: {
							type: 'categories',
							id: 'restaurants-and-cafes',
						},
					},
				);
			});

			it('should return true if the PATCH call returns 204', async () => {
				mockAxios.patch.mockResolvedValue({
					status: 204,
				});

				const res = await transaction.categorizeTransaction(
					'mock-id',
					'restaurants-and-cafes',
				);

				expect(res).toBe(true);
			});

			it('should return false if PATCH call responds otherwise', async () => {
				mockAxios.patch.mockResolvedValue({
					status: 200,
				});

				const res = await transaction.categorizeTransaction(
					'mock-id',
					'restaurants-and-cafes',
				);

				expect(res).toBe(false);
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
				mockAxios.patch.mockRejectedValue({
					response: {
						data: {
							errors: [mockUpError],
						},
					},
				});

				await expect(async () => {
					await transaction.categorizeTransaction(
						'mock-id',
						'restaurants-and-cafes',
					);
				}).rejects.toThrow(new UpErrorCollection([mockUpError]));
			});
		});
	});
});
