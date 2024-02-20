import Resource, {IResource} from '../Resource/Resource';
import {CategoryAttributes, CategoryRelationships} from '../types';

export interface ICategoryResource extends IResource {
    attributes: CategoryAttributes,
    relationships: CategoryRelationships
}

export default class CategoryResource extends Resource implements ICategoryResource  {
    constructor(id: string, categoryAttributes: CategoryAttributes, relationships: CategoryRelationships) {
        super(id, 'categories');
        this.attributes = categoryAttributes;
        this.relationships = relationships
    }

    attributes: CategoryAttributes;
    relationships: CategoryRelationships;
}