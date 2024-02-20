import Resource from "./resources/Resource/Resource";
import AccountResource from './resources/Account/AccountResource';
import TransactionResource from './resources/Transactions/TransactionResource';
import CategoryResource from './resources/Categories/CategoryResource';

export type AnyResource = AccountResource | TransactionResource | CategoryResource

export type ResourceLink = {
    self?: string
    related?: string
}

export type RelationshipResource = {
    data?: Resource,
    links?: ResourceLink
}

export type RelationshipResourceChildren = {
    data: Resource[],
    links?: ResourceLink
}

export type AccountRelationships = {
    transactions: {
        data: Resource[]
        links?: ResourceLink
    };
};



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

