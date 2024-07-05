import { Axios } from 'axios';
import { TransactionResponse } from '../../client';
import TransactionResource from '../../resources/Transactions/TransactionResource';

export const buildTransaction = (
	transaction: TransactionResponse,
	client?: Axios,
): TransactionResource => {
	const { id, relationships, attributes } = transaction;
	const { createdAt, settledAt } = transaction.attributes;

	const transactionRes = new TransactionResource(
		id,
		{
			...attributes,
			createdAt: new Date(createdAt),
			settledAt: settledAt ? new Date(settledAt) : undefined,
		},
		relationships,
	);

	if (client) transactionRes.setClient(client);

	return transactionRes;
};

export const buildTransactions = (
	transactions: TransactionResponse[],
): TransactionResource[] => {
	return transactions.map(transaction => buildTransaction(transaction));
};
