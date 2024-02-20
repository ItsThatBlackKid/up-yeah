import Resource, {IResource} from '../Resource/Resource';
import {AccountAttributes, AccountTypeEnum, MoneyObject, OwnershipTypeEnum} from '../types';
import {AccountRelationships} from '../../types';

export interface IAccountResource extends IResource {
    accountType: AccountTypeEnum;
    balance: MoneyObject;
    createdAt: Date;
    displayName: string;
    ownershipType: OwnershipTypeEnum;
    relationships: AccountRelationships
}

export default class AccountResource extends Resource implements IAccountResource {

    constructor(id: string, accountAttributes: AccountAttributes, relationships: AccountRelationships) {
        super(id, 'accounts')
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
}
