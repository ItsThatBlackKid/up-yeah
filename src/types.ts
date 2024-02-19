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

export type Maybe<T> = T | undefined | null

export type ResponseLinks = {
    prev?: Maybe<string>;
    next?: Maybe<string>;
};

export type ResourceResponseData = {
    id: string
    type: string
}

export type ResourceResponse = {
    data: ResourceResponseData[]
    links: ResponseLinks
}

