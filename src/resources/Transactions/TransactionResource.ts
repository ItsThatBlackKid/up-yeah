import Resource, { IResource } from '../Resource/Resource';
import {
	CardPurchaseMethodObject,
	CashbackObject,
	HoldInfoObject,
	MoneyObject,
	RoundUpObject,
	TransactionAttributes,
	TransactionRelationships,
	TransactionStatusEnum,
} from '../types';

export interface ITransactionResource extends IResource {
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
	settledAt?: Date;
	createdAt: Date;
	relationships: TransactionRelationships;
}

export default class TransactionResource extends Resource implements ITransactionResource {
	constructor(id: string, transactionAttributes: TransactionAttributes, relationships: TransactionRelationships) {
		super(id, 'transactions');
		this.relationships = relationships;
		this.amount = transactionAttributes.amount;
		this.cardPurchaseMethod = transactionAttributes.cardPurchaseMethod;
		this.cashBack = transactionAttributes.cashBack;
		this.createdAt = new Date(transactionAttributes.createdAt);
		this.settledAt = transactionAttributes.settledAt;
		this.description = transactionAttributes.description;
		this.foreignAmount = transactionAttributes.foreignAmount;
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
	isCategorizable: boolean;
	message?: string;
	rawText?: string;
	roundUp?: RoundUpObject;
	settledAt?: Date;
	status: TransactionStatusEnum;
	relationships: TransactionRelationships;
}
