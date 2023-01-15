import UpClient from "../lib/client/UpClient";

const getAccounts = async () => {
    const client = new UpClient({
        personalAccessToken: "xyz"
    });

    const resources = await client.getAccounts();
    const acc1 = resources[0];
    // tslint:disable-next-line:no-console
    console.log(resources);
    // tslint:disable-next-line:no-console
    console.log(acc1.relationships)
};

(async () => {
    await getAccounts();
})();
