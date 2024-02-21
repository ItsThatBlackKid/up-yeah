import {client}  from './client';

const getTags = async () => {
	const tags = await client.getTags();

	tags.resources.forEach(tag => {
		console.log(JSON.stringify(tag, null, 2))
	})
}

const tagTransaction = async () => {
	const transactions = await client.getTransactions();
	const {id} = transactions.resources[0];

	const sucess = await client.addTagsToTransaction(id, [
		{
			type: 'tags',
			id: 'random'
		}
	])
}

(async () => {
	await tagTransaction();
	await getTags()
})();