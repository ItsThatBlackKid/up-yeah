import { buildCategories, buildCategory } from '../buildResources/buildCategories';
import { mockGetCategoriesResponse } from '../../__mocks__/categoryData';
import {CategoryResource} from '../../resources';

const mockCategory = new CategoryResource(
	'hobbies',
	{
	
		name: 'Hobbies'
	
	},
	
	{
	
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
			}
	);
const mockCategory2 = new CategoryResource(
				'good-life',
				{
					name: 'Good Life'
				},
				{
					parent: {},
					children: {
						data: [],
					},
				}
			);
describe('buildCategories.ts', () => {
	it('should build category resource', () => {
		const category = buildCategory(mockGetCategoriesResponse.data[0]);

		expect(category).toMatchObject(mockCategory);
		expect(category).toBeInstanceOf(CategoryResource);
	});

	it('should build all categories', () => {
		const categories = buildCategories(mockGetCategoriesResponse.data);
		const expectedCategories: CategoryResource[] = [
			mockCategory,
			mockCategory2
		];

		expect(categories).toEqual(expectedCategories);
	});

});
