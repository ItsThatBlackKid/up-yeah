import mockAxios from '../../__mocks__/axios';
import { mockUpGetTransactionsEmpty } from '../../__mocks__/transactionData';
import { GetTransactionsQueryOptions, TransactionStatus } from '../../client';
import { buildTransactionQueryParams } from '../buildParams';

describe('buildTransactionQueryParams', () => {
	it('map options to params correctly', async () => {
		mockAxios.get.mockResolvedValue(mockUpGetTransactionsEmpty);

		const options: GetTransactionsQueryOptions = {
			pageSize: 10,
			filterStatus: TransactionStatus.HELD,
			filterSince: '2020-01-01T01:02:03+10:00',
			filterUntil: '2023-01-01T01:02:03+10:00',
			filterCategory: 'good-life',
			filterTag: 'Holiday',
		};

		const params = buildTransactionQueryParams(options);

		expect(params).toEqual({
			'page[size]': options.pageSize,
			'filter[status]': options.filterStatus,
			'filter[since]': options.filterSince,
			'filter[until]': options.filterUntil,
			'filter[category]': options.filterCategory,
			'filter[tag]': options.filterTag,
		});
	});
});
