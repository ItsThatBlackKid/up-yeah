import UpClient from "../lib/client/UpClient";
import {GetAccountsQueryOptions, GetTransactionsQueryOptions} from "../lib/client/types";
import {OwnershipTypeEnum} from "../lib/resources/types";
import {client} from './client';


const getAccounts = async () => {
    const accountCollection = await client.getAccounts();
    const acc1 = accountCollection.resources[0];
    // tslint:disable-next-line:no-console
    console.log(accountCollection);
    // tslint:disable-next-line:no-console
    console.log(acc1.relationships)
};



const getAccountsWithOptions = async () => {
    const options: GetAccountsQueryOptions = {
        filterAccOwnershipType: OwnershipTypeEnum.INDIVIDUAL
    }
    const collection = await client.getAccounts(options)

    collection.resources.forEach(res => {
        // tslint:disable-next-line:no-console
        console.log(res);
    })
}

const getTransactionsWithOptions = async () => {
    const options: GetTransactionsQueryOptions = {
        pageSize: 2,
        filterCategory: 'good-life'
    }

    const collection = await client.getTransactions(options)

    collection.resources.forEach(res => {
        // tslint:disable-next-line:no-console
        console.log(res);
    })
}

const getAccountsPagination = async () => {
    const pageSize = 2
    const options: GetAccountsQueryOptions = {
        pageSize
    }
    const collection = await client.getAccounts(options)

    while (collection.nextLink) {
        collection.resources.forEach((resource) => {
            // tslint:disable-next-line:no-console
            console.log(`printing the next ${pageSize} accounts: `)
            // tslint:disable-next-line:no-console
            console.log(``)
            // tslint:disable-next-line:no-console
            console.log(resource);
        })

       await collection.next();
        // tslint:disable-next-line:no-console
        console.log('next batch: ', collection.resources);
    }

    collection.resources.forEach(res => {
        // tslint:disable-next-line:no-console
        console.log(res);
    })
}

const getTransactionsByAccount = async () => {
    const accounts = await client.getAccounts();
    const acc0 = accounts.resources[0];

    const transactions = await acc0.getTransactions();

    transactions!.resources.forEach(transaction => console.log(JSON.stringify(transaction, null, 2)))
}

(async () => {
    getTransactionsByAccount()
    // await getTransactionsWithOptions();
    // await getAccountsPagination()
    // await getAccounts();
    // await getAccountsWithOptions();
})();
