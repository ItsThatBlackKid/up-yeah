import UpClient from "../lib/client/UpClient";
import {GetAccountsQueryOptions} from "../lib/client/types";
import {OwnershipTypeEnum} from "../lib/resources/types";

const client = new UpClient({
    personalAccessToken: '<up api token here>'
})

const listTransactions = async () => {
    const transactions = await client.listTransactions();
    const transaction1 = transactions[0];
    // tslint:disable-next-line:no-console
    console.log(transactions);
    // tslint:disable-next-line:no-console
    console.log(transaction1.relationships)
};

(async () => {
    await listTransactions();
})();
