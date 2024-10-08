import {client}  from './client';
import { runExample } from './util';
import {ResourceCollection, TagResource, TransactionResource} from "up-yeah";

const getTags = async () => {
	const tags: ResourceCollection<TagResource> = await client.getTags();

	tags.resources.forEach(tag => {
		console.log(JSON.stringify(tag, null, 2))
	})
}

const tagTransaction = async () => {
	const transactions:ResourceCollection<TransactionResource> = await client.getTransactions();
	const {id} = transactions.resources[0];

	const sucess = await client.addTagsToTransaction(id, [
		{
			type: 'tags',
			id: 'random'
		}
	])

	console.log('Tag Transaction Status: ', sucess);
}

(async () => {
	// await runExample('Tag Transaction', tagTransaction);
	// await runExample('Get Tags', getTags);
})();