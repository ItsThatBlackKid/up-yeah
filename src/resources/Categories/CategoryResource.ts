import Resource from '../Resource/Resource';
import {CategoryAttributes, CategoryRelationships, ResourceType} from '../types';

export interface ICategoryResource extends Resource {
    attributes: CategoryAttributes,
    relationships: CategoryRelationships
}

export default class CategoryResource implements ICategoryResource {
    constructor(id: string, categoryAttributes: CategoryAttributes, relationships: CategoryRelationships) {
        this.id = id;
        this.type = 'categories'
        this.attributes = categoryAttributes;
        this.relationships = relationships
    }

    attributes: CategoryAttributes;
    id: string;
    relationships: CategoryRelationships;
    type: ResourceType;
}