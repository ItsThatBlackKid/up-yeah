import { buildTag, buildTags } from '../buildResources';
import { mockTagRelationships, mockTags } from '../../__mocks__/tagData';
import TagResource from '../../resources/Tags/TagResource';

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

			expect(builtTags).toEqual(expect.arrayContaining(expectedTags));
		});
	});
});
