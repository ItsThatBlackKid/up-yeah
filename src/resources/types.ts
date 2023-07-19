export enum OwnershipTypeEnum {
    INDIVIDUAL = "INDIVIDUAL",
    JOINT = "JOINT",
}

export enum AccountTypeEnum {
    SAVER = 'SAVER',
    TRANSACTIONAL = 'TRANSACTIONAL'
}

export enum TransactionStatusEnum {
    HELD = 'HELD',
    SETTLED = 'SETTLED'
}

export enum CardPurchaseMethodEnum {
    BAR_CODE = 'BAR_CODE',
    OCR = 'OCR',
    CARD_PIN = 'CARD_PIN',
    CARD_DETAILS = 'CARD_DETAILS',
    CARD_ON_FILE = 'CARD_ON_FILE',
    ECOMMERCE = 'ECOMMERCE',
    MAGNETIC_STRIPE = 'MAGNETIC_STRIPE',
    CONTACTLESS = 'CONTACTLESS'
}


export type MoneyObject = {
    currencyCode: string;
    value: string;
    valueInBaseUnits: number;
};

export type AccountAttributes = {
    displayName: string;
    accountType: AccountTypeEnum;
    ownershipType: OwnershipTypeEnum;
    balance: MoneyObject;
    createdAt: Date;
};

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
