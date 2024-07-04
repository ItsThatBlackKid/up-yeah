import { GetAccountsQueryOptions, GetAccountsQueryParams } from '../../client';

export const buildAccountGetParams = (options?: GetAccountsQueryOptions): GetAccountsQueryParams | undefined => {
	if (!options) return undefined;

	const params: GetAccountsQueryParams = {};

	if (options.pageSize) {
		params['page[size]'] = options.pageSize;
	}

	if (options.filterAccOwnershipType) {
		params['filter[ownershipType]'] = options.filterAccOwnershipType;
	}

	if (options.filterAccType) {
		params['filter[accountType]'] = options.filterAccType;
	}

	return params;
};
