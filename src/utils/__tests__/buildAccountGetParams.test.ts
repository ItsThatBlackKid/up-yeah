import { GetAccountsQueryOptions } from '../../client';
import { AccountTypeEnum, OwnershipTypeEnum } from '../../resources/types';
import { buildAccountGetParams } from '../buildParams';

describe('buildAccountGetParams', () => {
	it('should map params correctly', () => {
		const options: GetAccountsQueryOptions = {
			pageSize: 10,
			filterAccType: AccountTypeEnum.SAVER,
			filterAccOwnershipType: OwnershipTypeEnum.INDIVIDUAL,
		};

		const params = buildAccountGetParams(options);

		expect(params).toEqual({
			'page[size]': options.pageSize,
			'filter[accountType]': options.filterAccType,
			'filter[ownershipType]': options.filterAccOwnershipType,
		});
	});
});
