import {RelationshipResource, RelationshipResourceChildren} from '../../types';



/**
 * Account Types
 */

export enum AccountTypeEnum {
    SAVER = 'SAVER',
    TRANSACTIONAL = 'TRANSACTIONAL'
}

export enum OwnershipTypeEnum {
    INDIVIDUAL = "INDIVIDUAL",
    JOINT = "JOINT",
}

export type AccountAttributes = {
    displayName: string;
    accountType: AccountTypeEnum;
    ownershipType: OwnershipTypeEnum;
    balance: MoneyObject;
    createdAt: Date;
};

export type MoneyObject = {
    currencyCode: string;
    value: string;
    valueInBaseUnits: number;
};

/**
 * End Account Types
 */

/**
 * Transaction Types
 */

export type TransactionAttributes = {
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
    settledAt?: Date,
    createdAt: Date
};

export type HoldInfoObject = {
    amount: MoneyObject
    foreignAmount?: MoneyObject
}

export type RoundUpObject = {
    amount: MoneyObject
    boostPortion?: MoneyObject
}

export type CashbackObject = {
    description: string
    amount: MoneyObject
}

export type CardPurchaseMethodObject = {
    method: CardPurchaseMethodEnum,
    cardNumberSuffix?: string
}

export type ResourceType = 'accounts' | 'transactions' | 'tags' | 'categories'
