/**
 * Created: 07/01/2023
 * Axios client to handle HTTP requests to the Up API
 */

import axios, { Axios, AxiosResponse } from 'axios';
import UpError from '../errors/UpError';
import UpErrorCollection from '../errors/UpErrorCollection';
import AccountResource from '../resources/Account/AccountResource';
import CategoryResource from '../resources/Categories/CategoryResource';
import ResourceCollection from '../resources/Resource/ResourceCollection';
import TagResource from '../resources/Tags/TagResource';
import TransactionResource from '../resources/Transactions/TransactionResource';
import { AccountTypeEnum, OwnershipTypeEnum } from '../resources/types';
import {
	buildAccount,
	buildAccounts,
	buildTags,
	buildTransaction,
	buildTransactions,
} from '../utils';
import {
	buildCategories,
	buildCategory,
} from '../utils/buildResources/buildCategories';
import {
	ErrorObject,
	GetAccountResponse,
	GetAccountsQueryOptions,
	GetAccountsQueryParams,
	GetAccountsResponse,
	GetTagsResponse,
	GetTransactionResponse,
	GetTransactionsQueryOptions,
	GetTransactionsQueryParams,
	ListTransactionResponse,
	PostTagPayload,
	UpClientOptions,
} from './types';
import {
	buildAccountGetParams,
	buildTransactionQueryParams,
} from '../utils/buildParams';

class UpClient {
	private readonly clientInstance: Axios;

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
	getClientInstance(): Axios {
		return this.clientInstance;
	}

	private buildAndThrowErrors = (e: any) => {
		const errors: ErrorObject[] | undefined = e.response?.data?.errors;

		if (!errors) {
			throw new UpErrorCollection([]);
		}

		const collectedErrors: UpError[] = [];

		errors.forEach(err => {
			collectedErrors.push(
				new UpError(err.status, err.title, err.detail, err.source),
			);
		});

		throw new UpErrorCollection(collectedErrors);
	};

	public getAccounts = async (
		options?: GetAccountsQueryOptions,
	): Promise<ResourceCollection<AccountResource>> => {
		try {
			let reqData: AxiosResponse<GetAccountsResponse> | undefined;

			const params = buildAccountGetParams(options);

			if (params) {
				reqData = await this.clientInstance.get<GetAccountsResponse>(
					'/accounts',
					{
						params,
					},
				);
			} else {
				reqData = await this.clientInstance.get<GetAccountsResponse>(
					'/accounts',
				);
			}

			const responseData = reqData.data;
			const accounts = responseData.data;

			const convertedAccounts: AccountResource[] =
				buildAccounts(accounts);

			return new ResourceCollection<AccountResource>(
				convertedAccounts,
				responseData.links,
				this.clientInstance,
			);
		} catch (e: any) {
			throw this.buildAndThrowErrors(e);
		}
	};

	async getAccount(id: string): Promise<AccountResource | undefined> {
		try {
			const data = (
				await this.clientInstance.get<GetAccountResponse>(
					`/account/${id}`,
				)
			).data;

			return buildAccount(data.data, this.clientInstance);
		} catch (e: any) {
			throw this.buildAndThrowErrors(e);
		}
	}

	private makeTransactionsGetCall = async (
		url: string,
		options?: GetTransactionsQueryOptions,
	) => {
		try {
			let listResponse;
			if (options) {
				const params = buildTransactionQueryParams(options);
				listResponse =
					await this.clientInstance.get<ListTransactionResponse>(
						url,
						{
							params,
						},
					);
			} else {
				listResponse =
					await this.clientInstance.get<ListTransactionResponse>(url);
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

	public getTransaction = async (transactionId: string) => {
		try {
			const {
				data: { data: transaction },
			} = await this.clientInstance.get<GetTransactionResponse>(
				`/transactions/${transactionId}`,
			);
			console.log(transaction);

			return buildTransaction(transaction, this.clientInstance);
		} catch (e) {
			if (e instanceof Error) {
				throw this.buildAndThrowErrors(e);
			}
		}
	};

	public getTransactions = async (
		options?: GetTransactionsQueryOptions,
	): Promise<ResourceCollection<TransactionResource>> => {
		return this.makeTransactionsGetCall('/transactions', options);
	};

	public getTransactionsByAccount = async (
		accountId: string,
		options?: GetTransactionsQueryOptions,
	): Promise<ResourceCollection<TransactionResource>> => {
		return this.makeTransactionsGetCall(
			`/accounts/${accountId}/transactions`,
			options,
		);
	};

	public getCategories = async (): Promise<
		ResourceCollection<CategoryResource>
	> => {
		try {
			const res = await this.clientInstance.get('/categories');
			const categoryData = res.data;

			const builtCategories = buildCategories(categoryData.data);

			return new ResourceCollection<CategoryResource>(
				builtCategories,
				{},
				this.clientInstance,
			);
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

			return new ResourceCollection<TagResource>(
				buildTags(tagData.data),
				tagData.links,
				this.clientInstance,
			);
		} catch (e: any) {
			throw this.buildAndThrowErrors(e);
		}
	};

	public addTagsToTransaction = async (
		transactionId: string,
		payload: PostTagPayload[],
	): Promise<boolean> => {
		try {
			const res = await this.clientInstance.post(
				`/transactions/${transactionId}/relationships/tags`,
				{
					data: payload,
				},
			);

			return res.status === 204;
		} catch (e: any) {
			throw this.buildAndThrowErrors(e);
		}
	};

	public removeTagsFromTransaction = async (
		transactionId: string,
		payload: PostTagPayload[],
	): Promise<boolean> => {
		try {
			const res = await this.clientInstance.delete(
				`/transactions/${transactionId}/relationships/tags`,
				{
					data: {
						data: payload,
					},
				},
			);

			return res.status === 204;
		} catch (e: any) {
			throw this.buildAndThrowErrors(e);
		}
	};
}

export default UpClient;
