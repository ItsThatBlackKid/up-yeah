import {Axios} from 'axios';
import {UpErrorObject, GetAccountsQueryParams, GetTransactionsQueryParams,} from '../../client';
import {UpError, UpErrorCollection} from '../../errors';
import {ResourceResponse} from '../../types';
import {ResourceType} from '../types';
import {IResource} from "./types";

export abstract class Resource implements IResource {
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
                await this.client.get<ResourceResponse<TResponse>>(link, params ? {params} : undefined)
            ).data;

            return dataRes;
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
    }
}
