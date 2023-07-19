import Resource from "./resources/Resource";

export type ResourceLink = {
    self?: string
    related?: string
}

export type RelationshipResource = {
    data?: Resource,
    links?: ResourceLink
}

export type AccountRelationships = {
    transactions: {
        data: Resource[]
        links?: ResourceLink
    };
};

export type TransactionRelationships = {
    account: RelationshipResource,
    transferAccount?: RelationshipResource
    category?: RelationshipResource
    parentCategory?: RelationshipResource
}

