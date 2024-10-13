import { Axios } from 'axios';
import { AccountResourceResponse } from '../../client';
import { AccountTypeEnum, OwnershipTypeEnum, AccountResource } from '../../resources';

export const buildAccount = (account: AccountResourceResponse, client?: Axios): AccountResource => {
	const { id, attributes, relationships } = account;

	const acc = new AccountResource(
		id,
		{
			...attributes,
			accountType: attributes.accountType as AccountTypeEnum,
			createdAt: new Date(attributes.createdAt),
			ownershipType: attributes.ownershipType as OwnershipTypeEnum,
		},
		relationships,
	);

	if(client) acc.setClient(client);

	return  acc;
};

export const buildAccounts = (accounts: AccountResourceResponse[], client?: Axios): AccountResource[] => {
	if (!accounts || accounts.length === 0) {
		return [];
	}
	const resources: AccountResource[] = [];
	accounts.forEach(account => {
		resources.push(buildAccount(account, client));
	});

	return resources;
};
