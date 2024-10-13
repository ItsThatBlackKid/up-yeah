import { GetAccountsQueryOptions, GetTransactionsQueryOptions } from 'up-yeah';
import {TransactionResource} from 'up-yeah/resources';
import { client } from './client';
import { runExample } from './util';

const listTransactions = async () => {
	const transactions = await client.getTransactions();
	const transaction1: TransactionResource = transactions.resources[0];

	console.log(transactions);
	console.log(transaction1.relationships);
	console.log(await transaction1.getAccount());
};

const getTransactionsWithOptions = async () => {
	const options: GetTransactionsQueryOptions = {
		pageSize: 2,
		filterCategory: 'good-life',
	};

	const collection = await client.getTransactions(options);

	collection.resources.forEach(res => {
		console.log(res);
	});

	const resources = await collection.next();
	collection.resources.forEach(res => {
		console.log(res);
	});

    resources!.forEach(res => {
		console.log(res);
	});
};

const getTransactionAccount = async () => {
	const transactions = await client.getTransactions();
	const transaction = transactions.resources[0];
	const account = await transaction.getAccount();

	console.log(transaction);
	console.log(account);
};

const getTransactionsByAccount = async () => {
	const options: GetAccountsQueryOptions = {};
	const transactions = await client.getTransactionsByAccount(
		'some-account-id',
		options,
	);

	console.log(transactions.resources.slice(0, 10));
};

(async () => {
    await runExample('List Transactions', listTransactions);
    await runExample('Get Transactions With Options', getTransactionsWithOptions);
    await runExample('Get Account By Transaction', getTransactionAccount)
})();
