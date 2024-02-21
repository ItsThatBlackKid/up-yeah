import { CategoryAttributes, CategoryRelationships } from '../types';
import CategoryResource from '../Categories/CategoryResource';

const mockAttributes: CategoryAttributes = {
	name: 'good-life',
};

const mockRelationships: CategoryRelationships = {
	parent: {
		data: {
			id: 'mockid',
			type: 'categories',
		},
	},
	children: {
		data: [],
	},
};

describe('CategoryResource', () => {
	it('should build CategoryResource successfully', () => {
		const category: CategoryResource = new CategoryResource('1', mockAttributes, mockRelationships);

		expect(category.id).toEqual('1');
		expect(category.attributes).toEqual(mockAttributes);
		expect(category.relationships).toEqual(mockRelationships);
	});
});
