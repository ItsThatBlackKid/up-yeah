import { Axios } from 'axios';
import {
	ErrorObject,
	GetAccountsQueryParams,
	GetTransactionsQueryParams,
} from '../../client';
import UpError from '../../errors/UpError';
import UpErrorCollection from '../../errors/UpErrorCollection';
import { ResourceResponse } from '../../types';
import { ResourceType } from '../types';

export interface IResource {
	type: ResourceType;
	id: string;
}

export default abstract class Resource implements IResource {
	protected client?: Axios;
	protected constructor(id: string, type: ResourceType) {
		this.id = id;
		this.type = type;
	}
	type: ResourceType;
	id: string;

	public setClient(client: Axios): void {
		this.client = client;
	}

	protected async handleLink<TResponse>(
		link: string,
		params?: GetAccountsQueryParams | GetTransactionsQueryParams,
	): Promise<ResourceResponse<TResponse>> {
		if (!this.client) {
			throw new Error('Client instance not provided');
		}

		try {
			const dataRes = (
				await this.client.get<ResourceResponse<TResponse>>(link, params ? { params} : undefined)
			).data;

			return dataRes;
		} catch (e: any) {
			const errors: ErrorObject[] | undefined = e.response.data.errors;
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
	}
}
