import AccountResource from '../../resources/Account/AccountResource';
import { AccountTypeEnum, OwnershipTypeEnum } from '../../resources/types';
import { buildAccount, buildAccounts } from '../buildResources';
import { mockAccountResponse, mockUpAccountsResponse } from '../../__mocks__/accountData';

describe('buildAccounts.tsx', () => {
	it('should build AccountResource correctly', () => {
		const account = buildAccount(mockAccountResponse);
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

	it('should build accounts', () => {
		const accounts = buildAccounts(mockUpAccountsResponse.data);

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

		expect(accounts).toEqual([expectedAccountResource]);
	});
});
