import { AccountResourceResponse, GetAccountsResponse } from '../client';

export const mockUpListAccountsEmpty: { data: GetAccountsResponse } = {
	data: {
		data: [],
		links: {
			prev: null,
			next: null,
		},
	},
};

export const mockAccountResponse: AccountResourceResponse = {
	type: 'accounts',
	id: 'mockId',
	attributes: {
		displayName: 'up-yeah',
		accountType: 'TRANSACTIONAL',
		ownershipType: 'INDIVIDUAL',
		balance: {
			currencyCode: 'AUD',
			value: '4.20',
			valueInBaseUnits: 420,
		},
		createdAt: '2021-09-23T01:12:00+10:00',
	},
	relationships: {
		transactions: {
			data: [],
		},
	},
};

export const mockAccountResponse2: AccountResourceResponse = {
	type: 'accounts',
	id: 'mockId2',
	attributes: {
		displayName: '2Up',
		accountType: 'TRANSACTIONAL',
		ownershipType: 'JOINT',
		balance: {
			currencyCode: 'AUD',
			value: '4.20',
			valueInBaseUnits: 420,
		},
		createdAt: '2021-09-23T01:12:00+10:00',
	},
	relationships: {
		transactions: {
			data: [],
		},
	},
};

export const mockUpAccountsResponse: GetAccountsResponse = {
	data: [mockAccountResponse, mockAccountResponse2],
	links: {
		prev: 'http://some.up.au/api/v1/account/endpoint/1',
		next: 'http://some.up.au/api/v1/account/endpoint/2',
	},
};

export const mockGetAccountResponse = {
	data: {
		data: {
			type: 'accounts',
			id: 'mockId',
			attributes: {
				displayName: 'up-yeah',
				accountType: 'TRANSACTIONAL',
				ownershipType: 'INDIVIDUAL',
				balance: {
					currencyCode: 'AUD',
					value: '4.20',
					valueInBaseUnits: 420,
				},
				createdAt: '2021-09-23T01:12:00+10:00',
			},
			relationships: {
				transactions: {
					data: [],
				},
			},
		},
	},
};
