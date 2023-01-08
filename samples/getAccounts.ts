import UpClient from "../lib/client/UpClient";

const getAccounts = async () => {
    const client = new  UpClient({
        personalAccessToken: "your_access_key"
    });

   const resources = await client.getAccounts();
   const acc1 = resources[0];
    // tslint:disable-next-line:no-console
   console.log(resources)
}

(async () => {
    await getAccounts();
})()