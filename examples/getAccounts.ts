import UpClient from "../lib/client/UpClient";

const getAccounts = async () => {
    const client = new UpClient({
        personalAccessToken: "up:yeah:lcQdPo6fY16UQ5HnDKonnja34NXva07D8A8ztPlFy3qy1paeGzuaEDaPCJvPrftH6029u8khwYzyc09OQTnvyhr4saDbSZjaQiNLktJPOJwo5KCSJiIDTqmag6yxzY1q"
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