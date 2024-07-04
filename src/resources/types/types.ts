import { Maybe, RelationshipResource, RelationshipResourceChildren, ResourceLinkRelatedRequired } from '../../types';

/**
 * Account Types
 */

export enum AccountTypeEnum {
	SAVER = 'SAVER',
	TRANSACTIONAL = 'TRANSACTIONAL',
}

export enum OwnershipTypeEnum {
	INDIVIDUAL = 'INDIVIDUAL',
	JOINT = 'JOINT',
}

export type AccountAttributes = {
	displayName: string;
	accountType: AccountTypeEnum;
	ownershipType: OwnershipTypeEnum;
	balance: MoneyObject;
	createdAt: Date;
};

export type MoneyObject = {
	currencyCode: string;
	value: string;
	valueInBaseUnits: number;
};

/**
 * End Account Types
 */

/**
 * Transaction Types
 */

export type TransactionAttributes = {
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
};

export type HoldInfoObject = {
	amount: MoneyObject;
	foreignAmount?: MoneyObject;
};

export type RoundUpObject = {
	amount: MoneyObject;
	boostPortion?: MoneyObject;
};

export type CashbackObject = {
	description: string;
	amount: MoneyObject;
};

export type CardPurchaseMethodObject = {
	method: CardPurchaseMethodEnum;
	cardNumberSuffix?: string;
};

export type TransactionRelationships = {
	account: RelationshipResource;
	transferAccount?: RelationshipResource;
	category?: RelationshipResource;
	parentCategory?: RelationshipResource;
};

export enum TransactionStatusEnum {
	HELD = 'HELD',
	SETTLED = 'SETTLED',
}

export enum CardPurchaseMethodEnum {
	BAR_CODE = 'BAR_CODE',
	OCR = 'OCR',
	CARD_PIN = 'CARD_PIN',
	CARD_DETAILS = 'CARD_DETAILS',
	CARD_ON_FILE = 'CARD_ON_FILE',
	ECOMMERCE = 'ECOMMERCE',
	MAGNETIC_STRIPE = 'MAGNETIC_STRIPE',
	CONTACTLESS = 'CONTACTLESS',
}

/**
 * End Transaction Types
 */

/**
 * Category Types
 */

export type CategoryAttributes = {
	// name of this category as seen in the Up application
	name: string;
};

export type CategoryRelationships = {
	parent: RelationshipResource;
	children: RelationshipResourceChildren;
};

/**
 * End Category Types
 */

/**
 * Tag Types
 */

export type TagTransactionLink = {
	links: ResourceLinkRelatedRequired;
};

export type TagRelationships = {
	transactions?: Maybe<TagTransactionLink>;
};

/**
 * End Tag Types
 */

export type ResourceType = 'accounts' | 'transactions' | 'tags' | 'categories' | 'unknwon';
