import {CategoryResponse} from '../../client';
import CategoryResource from '../../resources/Categories/CategoryResource';

export const buildCategory = (category: CategoryResponse): CategoryResource => {
    const {id, attributes, relationships} = category;
    return new CategoryResource(id, attributes, relationships)
}

export const buildCategories = (categories: CategoryResponse[]): CategoryResource[] => {
    return categories.map(category => buildCategory(category));
}