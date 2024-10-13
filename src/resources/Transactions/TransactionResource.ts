import {AccountResourceResponse} from '../../client';
import {buildAccount, buildAndThrowErrors} from '../../utils';
import {IResource, Resource,} from '../Resource';
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

export class TransactionResource extends Resource implements ITransactionResource {
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

	constructor(
		id: string,
		transactionAttributes: TransactionAttributes,
		relationships: TransactionRelationships,
	) {
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

	public async getAccount() {
		if (
			!this.relationships.account.links ||
			!this.relationships.account.links.related
		)
			throw new Error('No parent account found on transaction.');

		const accounts = await this.handleLink<AccountResourceResponse>(
			this.relationships.account.links?.related,
		);

		return buildAccount(accounts.data as AccountResourceResponse);
	}

	public async categorizeTransaction(
		transactionId: string,
		category: string,
	): Promise<boolean> {
		if (!this.client) {
			throw new Error('Client must be created first');
		}

		try {
			const res = await this.client.patch(
				`/transactions/${transactionId}/relationships/category`,
				{
					data: {
						type: 'categories',
						id: category,
					},
				},
			);
			return res.status === 204;
		} catch (e) {
			throw buildAndThrowErrors(e);
		}
	}
}
