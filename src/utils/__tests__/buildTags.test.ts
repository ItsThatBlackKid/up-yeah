import { buildTag, buildTags } from '../buildResources';
import { mockTagRelationships, mockTags } from '../../__mocks__/tagData';
import TagResource from '../../resources/Tags/TagResource';
import {Axios} from 'axios'

describe('buildTags.ts', () => {
	describe('buildTag', () => {
		const tag = buildTag({
			type: 'tags',
			id: 'Pizza Night',
			relationships: mockTagRelationships,
		});

		expect(tag.id).toEqual('Pizza Night');
		expect(tag.relationships).toEqual(mockTagRelationships);
	});

	describe('buildTags', () => {
		it('should build all tags', () => {
			const builtTags = buildTags(mockTags);

			const expectedTags: TagResource[] = [
				new TagResource('Pizza Night', mockTagRelationships),
				new TagResource('Holiday', {transactions: null})
			];

			expect(builtTags).toEqual(expectedTags);
		});
	});
});
