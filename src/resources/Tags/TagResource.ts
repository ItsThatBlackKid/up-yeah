import { IResource } from '../Resource';
import { TagRelationships } from '../types';
import Resource from '../Resource/Resource';

interface ITagResource extends IResource {
	relationships: TagRelationships;
}

export default class TagResource extends Resource implements ITagResource {
	relationships: TagRelationships;

	constructor(id: string, relationships: TagRelationships) {
		super(id, 'tags');
		this.relationships = relationships;
	}
}
