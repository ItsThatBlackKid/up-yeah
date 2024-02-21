import { GetCategoriesResponse } from '../client';

export const mockGetCategoriesResponse: GetCategoriesResponse = {
	data: [
		{
			type: 'categories',
			id: 'hobbies',
			attributes: {
				name: 'Hobbies',
			},
			relationships: {
				parent: {
					data: {
						type: 'categories',
						id: 'good-life',
					},
					links: {
						related: 'https://somegood.life/api/v1/etc',
					},
				},
				children: {
					data: [],
				},
			},
		},
		{
			type: 'categories',
			id: 'good-life',
			attributes: {
				name: 'Good Life',
			},
			relationships: {
				parent: {},
				children: {
					data: [],
				},
			},
		},
	],
};
