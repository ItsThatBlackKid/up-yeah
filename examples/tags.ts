import {client}  from './client';

const getTags = async () => {
	const tags = await client.getTags();

	tags.resources.forEach(tag => {
		console.log(JSON.stringify(tag, null, 2))
	})
}

(async () => {
	await getTags()
	// await getAccountsPagination()
	// await getAccounts();
	// await getAccountsWithOptions();
})();