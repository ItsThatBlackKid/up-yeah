import {IResource, Resource,} from '../Resource';
import {CategoryAttributes, CategoryRelationships} from '../types';

export interface ICategoryResource extends IResource {
	attributes: CategoryAttributes;
	relationships: CategoryRelationships;
}

export class CategoryResource extends Resource implements ICategoryResource {
	constructor(id: string, categoryAttributes: CategoryAttributes, relationships: CategoryRelationships) {
		super(id, 'categories');
		this.attributes = categoryAttributes;
		this.relationships = relationships;
	}

	attributes: CategoryAttributes;
	relationships: CategoryRelationships;
}
