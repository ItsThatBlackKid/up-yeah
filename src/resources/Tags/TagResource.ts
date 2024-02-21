import { IResource } from '../Resource';
import Resource from '../Resource/Resource';
import { TagRelationships } from '../types';

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
