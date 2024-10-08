import { Axios } from 'axios';
import {
	AccountResourceResponse,
	UpErrorObject,
	TransactionResponse
} from '../../client';
import {UpError, UpErrorCollection} from '../../errors';
import { Maybe, ResourceResponse, ResponseLinks } from '../../types';
import { buildAccounts, buildTransactions } from '../../utils';
import {AccountResource} from '../Account';
import {TransactionResource} from '../Transactions';
import { ResourceType } from '../types';
import {Resource} from './Resource';
import {IResourceLink} from "./types";


export class ResourceCollection<T extends Resource> implements IResourceLink<T> {
	private client: Axios;
	prevLink: Maybe<string>;
	nextLink: Maybe<string>;
	resources: T[];
	resourceType: ResourceType;
	constructor(resources: T[], links: ResponseLinks, client: Axios) {
		this.client = client;

		if (resources.length <= 0) {
			this.resources = [];
			this.resourceType = 'unknwon';
			return;
		}

		this.resourceType = resources[0].type;

		this.resources = resources.map(resource => {
			resource.setClient(client);
			return resource;
		});

		this.resources = resources;
		this.prevLink = links.prev;
		this.nextLink = links.next;
	}

	/**
	 * Retrieves the previous resource.
	 */
	public prev = async (): Promise<Maybe<T[]>> => {
		return await this.handleLink(this.prevLink);
	};

	public next = async (): Promise<Maybe<T[]>> => {
		return await this.handleLink(this.nextLink);
	};

	private nextAccount = (
		accRes: AccountResourceResponse[],
	): AccountResource[] => {
		return buildAccounts(accRes);
	};

	private nextTransactions = (
		transRes: TransactionResponse[],
	): TransactionResource[] => {
		return buildTransactions(transRes);
	};

	private handleLink = async (linkURL: Maybe<string>) => {
		if (!linkURL) {
			return null;
		}

		let res;
		try {
			if (this.resourceType === 'accounts') {
				res = await this.client.get<
					ResourceResponse<AccountResourceResponse>
				>(linkURL);
			} else if (this.resourceType === 'transactions') {
				res = await this.client.get<
					ResourceResponse<TransactionResponse>
				>(linkURL);
			}
		} catch (e: any) {
			const errors: UpErrorObject[] | undefined = e.response.data.errors;
			const collectedErrors: UpError[] = [];

			if (errors) {
				errors.forEach(err => {
					collectedErrors.push(
						new UpError(
							err.status,
							err.title,
							err.detail,
							err.source,
						),
					);
				});
			}

			throw new UpErrorCollection(collectedErrors);
		}
		
		if (!res || !res.data.data || (res.data.data as unknown as []).length === 0) {
			return null;
		}

		this.nextLink = res.data.links.next;
		this.prevLink = res.data.links.prev;

		if (this.resourceType === 'accounts') {
			this.resources = this.nextAccount(
				res.data.data as AccountResourceResponse[],
			) as unknown as T[];
			return this.resources;
		}

		if (this.resourceType === 'transactions') {
			this.resources = this.nextTransactions(
				res.data.data as TransactionResponse[],
			) as unknown as T[];
			return this.resources;
		}
	};
}
