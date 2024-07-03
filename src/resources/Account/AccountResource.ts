import {GetTransactionsQueryOptions, ListTransactionResponse} from "../../client";
import {AccountRelationships, Maybe} from '../../types';
import {buildTransactions} from "../../utils";
import Resource, { IResource } from '../Resource/Resource';
import ResourceCollection from "../Resource/ResourceCollection";
import TransactionResource from "../Transactions/TransactionResource";
import { AccountAttributes, AccountTypeEnum, MoneyObject, OwnershipTypeEnum } from '../types';
import {buildAndThrowErrors} from "../../utils/buildAndThrowErrors";

export interface IAccountResource extends IResource {
	accountType: AccountTypeEnum;
	balance: MoneyObject;
	createdAt: Date;
	displayName: string;
	ownershipType: OwnershipTypeEnum;
	relationships: AccountRelationships;
}

export default class AccountResource extends Resource implements IAccountResource {
	constructor(id: string, accountAttributes: AccountAttributes, relationships: AccountRelationships) {
		super(id, 'accounts');
		this.accountType = accountAttributes.accountType;
		this.balance = accountAttributes.balance;
		this.createdAt = accountAttributes.createdAt;
		this.displayName = accountAttributes.displayName;
		this.ownershipType = accountAttributes.ownershipType;
		this.relationships = relationships;
	}

	accountType: AccountTypeEnum;
	balance: MoneyObject;
	createdAt: Date;
	displayName: string;
	ownershipType: OwnershipTypeEnum;
	relationships: AccountRelationships;

	public getTransactions = async (options?: GetTransactionsQueryOptions): Promise<ResourceCollection<TransactionResource>> => {
		if(!this.client) {
			throw new Error('An UpClient axios instance must be provided before you can do that')
		}
		try {
			const url = this.relationships.transactions.links?.related ?? `/accounts/${this.id}/transactions`
			const  res = await this.client.get<ListTransactionResponse>(url);
			const transactions = res.data.data;

			return new ResourceCollection(buildTransactions(transactions), res.data.links, this.client);
		} catch (e: any) {
			throw buildAndThrowErrors(e);
		}
	}
}
