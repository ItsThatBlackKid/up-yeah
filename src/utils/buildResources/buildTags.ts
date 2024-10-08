import { TagResponse } from '../../client';
import {TagResource} from '../../resources';

export const buildTag = (tag: TagResponse): TagResource => {
	const { id, relationships } = tag;
	return new TagResource(id, relationships);
};

export const buildTags = (tags: TagResponse[]): TagResource[] => {
	return tags.map(tag => buildTag(tag));
};
