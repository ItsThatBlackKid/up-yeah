import {
	GetAccountsQueryOptions,
	GetTransactionsQueryOptions, OwnershipTypeEnum
} from '../lib';
import AccountResource from '../lib/resources/Account/AccountResource';
import { client } from './client';
import { runExample } from './util';

const getAccounts = async () => {
	const accountCollection = await client.getAccounts();
	const acc1: AccountResource  = accountCollection.resources[0];
	console.log(acc1);
	console.log(await acc1.getTransactions());
	console.log(acc1.relationships)
};

const getAccountsWithOptions = async () => {
	const options: GetAccountsQueryOptions = {
		filterAccOwnershipType: OwnershipTypeEnum.INDIVIDUAL,
	};
	const collection = await client.getAccounts(options);

	collection.resources.forEach(res => {
		console.log(res);
	});
};

const getAccountsPagination = async () => {
	const pageSize = 2;
	const options: GetAccountsQueryOptions = {
		pageSize,
	};
	const collection = await client.getAccounts(options);

	while (collection.nextLink) {
		collection.resources.forEach(resource => {
			console.log(`printing the next ${pageSize} accounts: `);
			console.log(``);
			console.log(resource);
		});

		await collection.next();
		console.log('next batch: ', collection.resources);
	}

	collection.resources.forEach(res => {
		console.log(res);
	});
};



(async () => {
	// await runExample('List Accounts', getAccounts);
	// await runExample('List Accounts -- Options', getAccountsPagination)
	// await runExample('List Accounts -- Pagination', getAccountsPagination);
})();
