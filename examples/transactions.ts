import UpClient from "../lib/client/UpClient";
import {GetAccountsQueryOptions} from "../lib/client/types";
import TransactionResource from "../lib/resources/Transactions/TransactionResource";
import {OwnershipTypeEnum} from "../lib/resources/types";

const client = new UpClient({
    personalAccessToken: '<up api token here>'
})

const listTransactions = async () => {
    const transactions = await client.getTransactions();
    const transaction1: TransactionResource = transactions[0];

    console.log(transactions);
    console.log(transaction1.relationships)
};

(async () => {
    await listTransactions();
})();
