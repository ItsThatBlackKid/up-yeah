import {
    GetAccountsQueryOptions,
    GetTransactionsQueryOptions,
} from '../lib/client/';
import { OwnershipTypeEnum } from '../lib/';
import { client } from './client';
import AccountResource from '../lib/resources/Account';
import UpErrorCollection from '../lib/errors/UpErrorCollection';

const getAccounts = async () => {
	const accountCollection = await client.getAccounts();
	const acc1: AccountResource  = accountCollection.resources[0];
    const error: UpErrorCollection
	// tslint:disable-next-line:no-console
	console.log(acc1);
	console.log(await acc1.getTransactions());
	// tslint:disable-next-line:no-console
	// console.log(acc1.relationships)
};

const getAccountsWithOptions = async () => {
	const options: GetAccountsQueryOptions = {
		filterAccOwnershipType: OwnershipTypeEnum.INDIVIDUAL,
	};
	const collection = await client.getAccounts(options);

	collection.resources.forEach(res => {
		// tslint:disable-next-line:no-console
		console.log(res);
	});
};

const getTransactionsWithOptions = async () => {
	const options: GetTransactionsQueryOptions = {
		pageSize: 2,
		filterCategory: 'good-life',
	};

	const collection = await client.getTransactions(options);

	collection.resources.forEach(res => {
		// tslint:disable-next-line:no-console
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
			// tslint:disable-next-line:no-console
			console.log(`printing the next ${pageSize} accounts: `);
			// tslint:disable-next-line:no-console
			console.log(``);
			// tslint:disable-next-line:no-console
			console.log(resource);
		});

		await collection.next();
		// tslint:disable-next-line:no-console
		console.log('next batch: ', collection.resources);
	}

	collection.resources.forEach(res => {
		// tslint:disable-next-line:no-console
		console.log(res);
	});
};

const getTransactionsByAccount = async () => {
	const accounts = await client.getAccounts();
	const acc0 = accounts.resources[0];

	const transactions = await acc0.getTransactions();

	transactions!.resources.forEach(transaction =>
		console.log(JSON.stringify(transaction, null, 2)),
	);
};

(async () => {
	// getTransactionsByAccount()
	// await getTransactionsWithOptions();
	// await getAccountsPagination()
	await getAccounts();
	// await getAccountsWithOptions();
})();
