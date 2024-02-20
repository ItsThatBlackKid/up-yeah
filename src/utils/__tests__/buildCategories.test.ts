import {buildCategories, buildCategory} from '../buildResources/buildCategories';
import {mockGetCategoriesResponse} from '../../__mocks__/categoryData';
import CategoryResource from '../../resources/Categories/CategoryResource';

describe('buildCategories.ts', () => {
    it('should build category resource', () => {
        const category = buildCategory(mockGetCategoriesResponse.data[0]);
        const expectedCategory: CategoryResource = {
            id: 'hobbies',
            type: 'categories',
            attributes: {
                name: 'Hobbies'
            },
            relationships: {
                parent: {
                    data: {
                        id: 'good-life',
                        type: 'categories'
                    },
                    links: {
                        related: 'https://somegood.life/api/v1/etc'
                    }
                },
                children: {
                    data: []
                }
            }
        };

        expect(category).toEqual(expectedCategory);
    });

    it('should build all categories', () => {
        const categories = buildCategories(mockGetCategoriesResponse.data);
        const expectedCategories: CategoryResource[] = [
            {
                id: 'hobbies',
                type: 'categories',
                attributes: {
                    name: 'Hobbies'
                },
                relationships: {
                    parent: {
                        data: {
                            id: 'good-life',
                            type: 'categories'
                        },
                        links: {
                            related: 'https://somegood.life/api/v1/etc'
                        }
                    },
                    children: {
                        data: []
                    }
                }
            },
            {
                id: 'good-life',
                type: 'categories',
                attributes: {
                    name: 'Good Life'
                },
                relationships: {
                    parent: {

                    },
                    children: {
                        data: []
                    }
                }
            }
        ]

        expect(categories).toEqual(expectedCategories);
    })
});