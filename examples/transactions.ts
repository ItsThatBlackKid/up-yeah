import TransactionResource from "../lib/resources/Transactions/TransactionResource";
import { client } from "./client";

const listTransactions = async () => {
    const transactions = await client.getTransactions();
    const transaction1: TransactionResource = transactions.resources[0];

    console.log(transactions);
    console.log(transaction1.relationships);
    console.log(await transaction1.getAccount())
};

(async () => {
    await listTransactions();
})();
