/**
 * Created: 07/01/2023
 * Axios client to handle HTTP requests to the Up API
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import UpError from '../errors/UpError';
import UpErrorCollection from '../errors/UpErrorCollection';
import AccountResource from '../resources/Account/AccountResource';
import CategoryResource from '../resources/Categories/CategoryResource';
import ResourceCollection from '../resources/Resource/ResourceCollection';
import TagResource from '../resources/Tags/TagResource';
import TransactionResource from '../resources/Transactions/TransactionResource';
import { AccountTypeEnum, OwnershipTypeEnum } from '../resources/types';
import { buildAccounts, buildTransactions } from '../utils';
import { buildCategories, buildCategory } from '../utils/buildResources/buildCategories';
import {
	ErrorObject,
	GetAccountResponse,
	GetAccountsQueryOptions,
	GetAccountsResponse,
	GetTagsResponse,
	GetTransactionsQueryOptions,
	ListTransactionResponse, PostTagPayload,
	TransactionStatus,
	UpClientOptions,
} from './types';

interface GetAccountsQueryParams {
	'page[size]'?: number;
	'filter[accountType]'?: AccountTypeEnum;
	'filter[ownershipType]'?: OwnershipTypeEnum;
}

interface GetTransactionsQueryParams {
	'page[size]'?: number;
	'filter[status]'?: TransactionStatus;
	'filter[since]'?: string;
	'filter[until]'?: string;
	'filter[category]'?: string;
	'filter[tag]'?: string;
}

class UpClient {
	private readonly clientInstance: AxiosInstance;

	/**
	 * Creates axios client instance with relevant options to the Up API
	 * @param options Options for the client
	 */
	constructor(options: UpClientOptions) {
		this.clientInstance = axios.create({
			baseURL: 'https://api.up.com.au/api/v1',
			headers: {
				Authorization: `Bearer  ${options.personalAccessToken}`,
			},
		});
	}

	/**
	 * Getter for the clientInstance property.
	 */
	getClientInstance(): AxiosInstance {
		return this.clientInstance;
	}

	private buildQueryParams = (options?: GetAccountsQueryOptions): GetAccountsQueryParams | undefined => {
		if (!options) return undefined;

		const params: GetAccountsQueryParams = {};

		if (options.pageSize) {
			params['page[size]'] = options.pageSize;
		}

		if (options.filterAccOwnershipType) {
			params['filter[ownershipType]'] = options.filterAccOwnershipType;
		}

		if (options.filterAccType) {
			params['filter[accountType]'] = options.filterAccType;
		}

		return params;
	};

	private buildTransactionQueryParams = (options: GetTransactionsQueryOptions): GetTransactionsQueryParams => {
		const params: GetTransactionsQueryParams = {};

		if (options.pageSize) {
			params['page[size]'] = options.pageSize;
		}

		if (options.filterStatus) {
			params['filter[status]'] = options.filterStatus;
		}

		if (options.filterSince) {
			params['filter[since]'] = options.filterSince;
		}

		if (options.filterUntil) {
			params['filter[until]'] = options.filterUntil;
		}

		if (options.filterCategory) {
			params['filter[category]'] = options.filterCategory;
		}

		if (options.filterTag) {
			params['filter[tag]'] = options.filterTag;
		}

		return params;
	};

	private buildAndThrowErrors = (e: any) => {
		const errors: ErrorObject[] | undefined = e.response.data.errors;
		const collectedErrors: UpError[] = [];

		if (errors) {
			errors.forEach(err => {
				collectedErrors.push(new UpError(err.status, err.title, err.detail, err.source));
			});
		}

		throw new UpErrorCollection(collectedErrors);
	};

	public getAccounts = async (options?: GetAccountsQueryOptions): Promise<ResourceCollection<AccountResource>> => {
		try {
			let reqData: AxiosResponse<GetAccountsResponse> | undefined;

			const params = this.buildQueryParams(options);

			if (params) {
				reqData = await this.clientInstance.get<GetAccountsResponse>('/accounts', {
					params,
				});
			} else {
				reqData = await this.clientInstance.get<GetAccountsResponse>('/accounts');
			}

			const responseData = reqData.data;
			const accounts = responseData.data;

			const convertedAccounts: AccountResource[] = buildAccounts(accounts);

			return new ResourceCollection<AccountResource>(convertedAccounts, responseData.links, this.clientInstance);
		} catch (e: any) {
			throw this.buildAndThrowErrors(e);
		}
	};

	async getAccount(id: string): Promise<AccountResource | undefined> {
		try {
			const data = (await this.clientInstance.get<GetAccountResponse>(`/account/${id}`)).data;
			const account = data.data;
			const ownerShipType: OwnershipTypeEnum = account.attributes.ownershipType as OwnershipTypeEnum;

			return new AccountResource(
				account.id,
				{
					accountType: account.attributes.accountType as AccountTypeEnum,
					balance: account.attributes.balance,
					createdAt: new Date(account.attributes.createdAt),
					displayName: account.attributes.displayName,
					ownershipType: ownerShipType,
				},
				account.relationships,
			);
		} catch (e: any) {
			throw this.buildAndThrowErrors(e);
		}
	}

	public getTransactions = async (
		options?: GetTransactionsQueryOptions,
	): Promise<ResourceCollection<TransactionResource>> => {
		try {
			let listResponse;
			if (options) {
				const params = this.buildTransactionQueryParams(options);
				listResponse = await this.clientInstance.get<ListTransactionResponse>('/transactions', {
					params,
				});
			} else {
				listResponse = await this.clientInstance.get<ListTransactionResponse>('/transactions');
			}
			const transactionData = listResponse.data;

			const builtTransactions = buildTransactions(transactionData.data);

			return new ResourceCollection<TransactionResource>(
				builtTransactions,
				transactionData.links,
				this.clientInstance,
			);
		} catch (e: any) {
			throw this.buildAndThrowErrors(e);
		}
	};

	public getCategories = async (): Promise<ResourceCollection<CategoryResource>> => {
		try {
			const res = await this.clientInstance.get('/categories');
			const categoryData = res.data;

			const builtCategories = buildCategories(categoryData.data);

			return new ResourceCollection<CategoryResource>(builtCategories, {}, this.clientInstance);
		} catch (e: any) {
			throw this.buildAndThrowErrors(e);
		}
	};

	public getCategory = async (id: string): Promise<CategoryResource> => {
		try {
			const res = await this.clientInstance.get(`/categories/${id}`);
			const categoryData = res.data;

			return buildCategory(categoryData.data);
		} catch (e: any) {
			throw this.buildAndThrowErrors(e);
		}
	};

	public getTags = async (): Promise<ResourceCollection<TagResource>> => {
		try {
			const res = await this.clientInstance.get<GetTagsResponse>('/tags');
			const tagData = res.data;

			return new ResourceCollection<TagResource>(tagData.data, tagData.links, this.clientInstance);
		} catch (e: any) {
			throw this.buildAndThrowErrors(e);
		}
	};

	public addTagsToTransaction = async (transactionId: string, payload: PostTagPayload[]): Promise<boolean> => {
		try {
			const res = await this.clientInstance.post(`/transactions/${transactionId}/relationships/tags`, {
				data: payload
			});
			// tslint:disable-next-line:no-console
			console.log(res);

			return res.status === 204;
		} catch (e: any) {
			throw this.buildAndThrowErrors(e);
		}
	}

	public removeTagsFromTransaction = async (transactionId: string, payload: PostTagPayload[]): Promise<boolean> => {
		try {
			const res = await this.clientInstance.delete(`/transactions/${transactionId}/relationships/tags`, {
				data: {
					data: payload
				}
			});

			return res.status === 204;
		} catch (e: any) {
			throw this.buildAndThrowErrors(e);
		}
	}
}

export default UpClient;
