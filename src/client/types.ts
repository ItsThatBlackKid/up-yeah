import {
    AccountTypeEnum, CardPurchaseMethodObject, CashbackObject, CategoryRelationships,
    HoldInfoObject,
    MoneyObject,
    OwnershipTypeEnum, RoundUpObject,
    TransactionStatusEnum
} from "../resources/types";
import {AccountRelationships, ResourceLink, ResponseLinks} from "../types";
import {TransactionRelationships} from '../resources/types';

export type UpClientOptions = {
    personalAccessToken: string;
};


type AccountAttributes = {
    displayName: string;
    accountType: string;
    balance: MoneyObject;
    createdAt: string;
    ownershipType: string;
};

export type AccountResourceResponse = {
    type: string;
    id: string;
    attributes: AccountAttributes;
    relationships: AccountRelationships;
    links?: {
        self: string;
    };
};

export type TransactionAttributesResponse = {
    status: TransactionStatusEnum;
    rawText?: string;
    description: string;
    message?: string;
    isCategorizable: boolean;
    holdInfo?: HoldInfoObject;
    roundUp?: RoundUpObject;
    cashBack?: CashbackObject;
    amount: MoneyObject;
    foreignAmount?: MoneyObject;
    cardPurchaseMethod?: CardPurchaseMethodObject;
    settledAt?: string;
    createdAt: string;
}

export type TransactionResponse = {
    type: string;
    id: string;
    attributes: TransactionAttributesResponse,
    relationships: TransactionRelationships,
    links: ResourceLink
}

export type ListTransactionResponse = {
    data: TransactionResponse[],
    links: ResponseLinks;
}

export type GetAccountsResponse = {
    data: AccountResourceResponse[];
    links: ResponseLinks;
};

export type GetAccountResponse = {
    data: AccountResourceResponse;
    links: ResponseLinks;
}

export type GetAccountsQueryOptions = {
    pageSize?: number,
    filterAccType?: AccountTypeEnum,
    filterAccOwnershipType?: OwnershipTypeEnum
}

export type GetTransactionsQueryOptions = {
    pageSize?: number,
    filterStatus?: TransactionStatus,
    filterSince?: string,
    filterUntil?: string,
    filterCategory?: string,
    filterTag?: string
}

export type CategoryAttributeResponse = {
    name: string
}


export type CategoryResponse = {
    type: 'categories',
    id: string,
    attributes: CategoryAttributeResponse,
    relationships: CategoryRelationships
}

export type GetCategoriesResponse = {
    data: CategoryResponse[],
    links?: ResponseLinks
}

export type ErrorObject = {
    status: string;
    title: string;
    detail: string;
    source?: {
        parameter?: string;
        pointer?: string;
    };
};

export enum TransactionStatus {
    HELD = "HELD",
    SETTLED = "SETTLED"
}
