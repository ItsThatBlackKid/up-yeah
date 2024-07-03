import {AccountRelationships} from '../../../types';
import AccountResource from '../../Account/AccountResource';
import {AccountAttributes, AccountTypeEnum, OwnershipTypeEnum} from '../../types';
import mockAxios from "jest-mock-axios";
import {mockListTransactionsResponse} from "../../../__mocks__/transactionData";
import {AxiosInstance} from "axios";

const mockAttributes: AccountAttributes = {
	displayName: 'test',
	accountType: AccountTypeEnum.SAVER,
	ownershipType: OwnershipTypeEnum.INDIVIDUAL,
	balance: {
		currencyCode: 'AUD',
		value: '12',
		valueInBaseUnits: 1200,
	},
	createdAt: new Date(11122),
};

const mockRelationShips: AccountRelationships = {
	transactions: {
		data: [{ type: 'transactions', id: 'mockId' }],
		links: undefined,
	},
};
describe('AccountResource', () => {
	it('should build AccountResource correctly', () => {
		const acc: AccountResource = new AccountResource('1', mockAttributes, mockRelationShips);

		expect(acc.id).toEqual('1');
		expect(acc.createdAt).toEqual(new Date(11122));
		expect(acc.accountType).toEqual('SAVER');
		expect(acc.displayName).toEqual('test');
		expect(acc.ownershipType).toEqual(OwnershipTypeEnum.INDIVIDUAL);
		expect(acc.balance).toEqual({
			currencyCode: 'AUD',
			value: '12',
			valueInBaseUnits: 1200,
		});

		expect(acc.relationships).toEqual(mockRelationShips);
		expect(acc.type).toEqual('accounts');
	});

	describe('getTransactions',  () => {
		it('should return throw an error if no client provided', async () => {
			const acc: AccountResource = new AccountResource('1', mockAttributes, mockRelationShips);
			await expect(async () => {
				await acc.getTransactions()
			}).rejects.toThrow(new Error('An UpClient axios instance must be provided before you can do that'))
		});

		it('should make get call using id if no transaction link provided', async () => {
			mockAxios.get.mockResolvedValue(mockListTransactionsResponse)
			const acc: AccountResource = new AccountResource('1', mockAttributes, mockRelationShips);
			acc.setClient(mockAxios as unknown as AxiosInstance)

			await acc.getTransactions();

			expect(mockAxios.get).toHaveBeenCalledWith('/accounts/1/transactions')
		});

		it('should make get call using transaction links', async () => {
			mockAxios.get.mockResolvedValue(mockListTransactionsResponse)
			const expectedLink = 'https://up.api.com/v1/accounts/2/transactions'
			const acc: AccountResource = new AccountResource('1', mockAttributes, {
				transactions: {
					...mockRelationShips.transactions,
					links: {
						related: expectedLink
					}
				}
			});
			acc.setClient(mockAxios as unknown as AxiosInstance)

			await acc.getTransactions();

			expect(mockAxios.get).toHaveBeenCalledWith(expectedLink)
		});
	});
});
