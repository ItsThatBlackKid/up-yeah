import Resource from "./Resource";
import {
    CardPurchaseMethodObject,
    CashbackObject,
    HoldInfoObject,
    MoneyObject, ResourceType,
    RoundUpObject, TransactionAttributes,
    TransactionStatusEnum
} from "./types";
import {TransactionRelationships} from "../types";

export interface ITransactionResource extends Resource{
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
    relationships: TransactionRelationships
}

export default class TransactionResource implements ITransactionResource {
    constructor(id: string, transactionAttributes: TransactionAttributes, relationships: TransactionRelationships) {
        this.id = id;
        this.relationships = relationships;
        this.resourceType = 'transactions';
        this.amount = transactionAttributes.amount;
        this.cardPurchaseMethod = transactionAttributes.cardPurchaseMethod;
        this.cashBack = transactionAttributes.cashBack;
        this.createdAt = new Date(transactionAttributes.createdAt);
        this.settledAt = transactionAttributes.settledAt;
        this.description = transactionAttributes.description;
        this.foreignAmount = transactionAttributes.foreignAmount
        this.holdInfo = transactionAttributes.holdInfo;
        this.isCategorizable = transactionAttributes.isCategorizable;
        this.status = transactionAttributes.status;
    }

    amount: MoneyObject;
    cardPurchaseMethod?: CardPurchaseMethodObject;
    cashBack?: CashbackObject;
    createdAt: Date;
    description: string;
    foreignAmount?: MoneyObject;
    holdInfo?: HoldInfoObject;
    id: string;
    isCategorizable: boolean;
    message?: string;
    rawText?: string;
    resourceType: ResourceType;
    roundUp?: RoundUpObject;
    settledAt?: Date;
    status: TransactionStatusEnum;
    relationships: TransactionRelationships;

}