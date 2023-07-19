import UpClient from "../lib/client/UpClient";
import {GetAccountsQueryOptions} from "../lib/client/types";
import {OwnershipTypeEnum} from "../lib/resources/types";

const client = new UpClient({
    personalAccessToken: 'xyz'
})

const getAccounts = async () => {
    const resources = await client.getAccounts();
    const acc1 = resources[0];
    // tslint:disable-next-line:no-console
    console.log(resources);
    // tslint:disable-next-line:no-console
    console.log(acc1.relationships)
};

const getAccountsWithOptions = async () => {
    const options: GetAccountsQueryOptions = {
        filterAccOwnershipType: OwnershipTypeEnum.INDIVIDUAL
    }
    const resources = await client.getAccounts(options)

    resources.forEach(res => {
        // tslint:disable-next-line:no-console
        console.log(res);
    })
}

(async () => {
    await getAccounts();
    await getAccountsWithOptions();
})();
