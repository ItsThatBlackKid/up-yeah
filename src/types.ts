import { IResource } from './resources';

export type ResourceLink = {
	self?: string;
	related?: string;
};

export type ResourceLinkRelatedRequired = {
	related: string;
};

export type RelationshipResource = {
	data?: IResource;
	links?: ResourceLink;
};

export type RelationshipResourceChildren = {
	data: IResource[];
	links?: ResourceLink;
};

export type AccountRelationships = {
	transactions: {
		data: IResource[];
		links?: ResourceLink;
	};
};

export type Maybe<T> = T | undefined | null;

export type ResponseLinks = {
	prev?: Maybe<string>;
	next?: Maybe<string>;
};

export type ResourceResponseData = {
	id: string;
	type: string;
};

export type ResourceResponse <T> = {
	data: Array<T> | T;
	links: ResponseLinks;
};
