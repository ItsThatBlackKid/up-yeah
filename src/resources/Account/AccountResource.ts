import Resource from '../Resource';
import {AccountAttributes, AccountTypeEnum, MoneyObject, OwnershipTypeEnum, ResourceType} from '../types';
import {AccountRelationships} from '../../types';

export interface IAccountResource extends Resource {
    accountType: AccountTypeEnum;
    balance: MoneyObject;
    createdAt: Date;
    displayName: string;
    ownershipType: OwnershipTypeEnum;
    relationships: AccountRelationships
}

export default class AccountResource implements IAccountResource {

    constructor(id: string, accountAttributes: AccountAttributes, relationships: AccountRelationships) {

        this.id = id;
        this.resourceType = 'accounts';
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
    id: string;
    ownershipType: OwnershipTypeEnum;
    resourceType: ResourceType;
    relationships: AccountRelationships;


}
