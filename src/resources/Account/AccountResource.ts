import { GetTransactionsQueryOptions, TransactionResponse } from '../../client';
import { AccountRelationships } from '../../types';
import { buildTransactions } from '../../utils';
import { buildTransactionQueryParams } from '../../utils/buildParams';
import Resource, { IResource } from '../Resource/Resource';
import ResourceCollection from '../Resource/ResourceCollection';
import TransactionResource from '../Transactions/TransactionResource';
import {
	AccountAttributes,
	AccountTypeEnum,
	MoneyObject,
	OwnershipTypeEnum,
} from '../types';

export interface IAccountResource extends IResource {
	accountType: AccountTypeEnum;
	balance: MoneyObject;
	createdAt: Date;
	displayName: string;
	ownershipType: OwnershipTypeEnum;
	relationships: AccountRelationships;
}

export default class AccountResource
	extends Resource
	implements IAccountResource
{
	constructor(
		id: string,
		accountAttributes: AccountAttributes,
		relationships: AccountRelationships,
	) {
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

	public async getTransactions(
		options?: GetTransactionsQueryOptions,
	): Promise<ResourceCollection<TransactionResource>> {
		const url =
			this.relationships.transactions.links?.related ??
			`/accounts/${this.id}/transactions`;

		const { data, links } = await this.handleLink<TransactionResponse>(
			url,
			options ? buildTransactionQueryParams(options) : undefined,
		);

		return new ResourceCollection(
			buildTransactions(data as TransactionResponse[]),
			links,
			this.client!,
		);
	}
}
