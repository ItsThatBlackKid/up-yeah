import { GetTagsResponse, PostTagPayload, TagResponse } from '../client';
import { TagRelationships } from '../resources/types';

export const mockTagRelationships: TagRelationships = {
	transactions: {
		links: {
			related: 'http://someapi.com.au/api/v1/transactions?filter%5Btag%5D=Pizza+Night',
		},
	},
};

export const mockTags: TagResponse[] = [
	{
		type: 'tags',
		id: 'Pizza Night',
		relationships: mockTagRelationships,
	},
	{
		type: 'tags',
		id: 'Holiday',
		relationships: {
			transactions: null,
		},
	},
];

export const mockTagsResponse: GetTagsResponse = {
	data: mockTags,
	links: {
		prev: null,
		next: null,
	},
};

export const mockTagPayload: PostTagPayload = {
	type: 'tags',
	id: 'queensland'
}
