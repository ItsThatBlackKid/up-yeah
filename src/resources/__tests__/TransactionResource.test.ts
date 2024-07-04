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
				undefined
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
});
