import {Resource} from '../Resource';
import {TagRelationships} from '../types';
import {ITagResource} from "./types";

export class TagResource extends Resource implements ITagResource {
	relationships: TagRelationships;

	constructor(id: string, relationships: TagRelationships) {
		super(id, 'tags');
		this.relationships = relationships;
	}
}
