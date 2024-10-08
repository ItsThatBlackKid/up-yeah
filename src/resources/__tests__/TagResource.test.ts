import {TagResource} from '../Tags';
import { mockTagRelationships } from '../../__mocks__/tagData';

describe('TagResource', () => {
	it('should build TagResource correctly', () => {
		const tag = new TagResource('Pizza Night', mockTagRelationships);

		expect(tag.id).toEqual('Pizza Night');
		expect(tag.relationships).toEqual(mockTagRelationships);
	});
});
