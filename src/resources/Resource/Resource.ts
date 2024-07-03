import {ResourceType} from '../types';
import {Axios} from "axios";

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

	public setClient = (client: Axios) => {
		this.client = client;
	}
}
