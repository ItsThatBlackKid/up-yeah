import {TransactionResponse} from '../../client';
import TransactionResource from '../../resources/Transactions/TransactionResource';

export const buildTransaction = (transaction: TransactionResponse): TransactionResource => {
    const {id, relationships, attributes} = transaction;
    const {createdAt, settledAt} = transaction.attributes;

    return new TransactionResource(id, {
        ...attributes,
        createdAt: new Date(createdAt),
        settledAt: !!settledAt ? new Date(settledAt) : undefined
    }, relationships)
}

export const buildTransactions = (transactions: TransactionResponse[]): TransactionResource[] => {
    return transactions.map(transaction =>  buildTransaction(transaction))
}