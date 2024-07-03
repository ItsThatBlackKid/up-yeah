import AccountResource from '../../resources/Account/AccountResource';
import { AccountTypeEnum, OwnershipTypeEnum } from '../../resources/types';
import { buildAccount, buildAccounts } from '../buildResources';
import { mockAccountResponse, mockUpAccountsResponse } from '../../__mocks__/accountData';

describe('buildAccounts', () => {
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

		expect(JSON.stringify(account)).toEqual(JSON.stringify(expectedAccountResource));
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
		expect(JSON.stringify(accounts)).toEqual(JSON.stringify([expectedAccountResource, expectedAccountResource2]));
	});
});
