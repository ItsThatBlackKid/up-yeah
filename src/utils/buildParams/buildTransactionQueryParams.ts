import { GetTransactionsQueryOptions, GetTransactionsQueryParams } from '../../client';

export const buildTransactionQueryParams = (options: GetTransactionsQueryOptions): GetTransactionsQueryParams => {
	const params: GetTransactionsQueryParams = {};

	if (options.pageSize) {
		params['page[size]'] = options.pageSize;
	}

	if (options.filterStatus) {
		params['filter[status]'] = options.filterStatus;
	}

	if (options.filterSince) {
		params['filter[since]'] = options.filterSince;
	}

	if (options.filterUntil) {
		params['filter[until]'] = options.filterUntil;
	}

	if (options.filterCategory) {
		params['filter[category]'] = options.filterCategory;
	}

	if (options.filterTag) {
		params['filter[tag]'] = options.filterTag;
	}

	return params;
};
