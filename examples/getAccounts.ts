import UpClient from "../lib/client/UpClient";
import UpErrorCollection from '../lib/errors/UpErrorCollection';

const getAccounts = async () => {
    const client = new UpClient({
        personalAccessToken: ""
    });

    try {
        const resources = await client.getAccounts();
        const acc1 = resources[0];
        // tslint:disable-next-line:no-console
        console.log(resources);
        // tslint:disable-next-line:no-console
        console.log(acc1.relationships)
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.log(e);
        // tslint:disable-next-line:no-console
        console.log((e as UpErrorCollection).getFirstError())
    }


};

(async () => {
    await getAccounts();
})();
