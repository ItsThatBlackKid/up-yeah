import Resource from './Resource';
import { AccountAttributes, MoneyObject, OwnershipTypeEnum } from './types';
import { AccountRelationships } from '../types';

export default class AccountResource extends Resource {
  private readonly _id: string;
  private readonly _resourceType: string = 'accounts';

  private readonly _accountType: string;
  private readonly _balance: MoneyObject;
  private readonly _createdAt: Date;
  private readonly _displayName: string;
  private readonly _ownershipType: OwnershipTypeEnum;

  private readonly _relationships: AccountRelationships;

  constructor(id: string, accountAttributes: AccountAttributes, relationships: AccountRelationships) {
    super();

    this._id = id;
    this._accountType = accountAttributes.accountType;
    this._balance = accountAttributes.balance;
    this._createdAt = accountAttributes.createdAt;
    this._displayName = accountAttributes.displayName;
    this._ownershipType = accountAttributes.ownershipType;
    this._relationships = relationships;
  }

  get id(): string {
    return this._id;
  }

  get resourceType(): string {
    return this._resourceType;
  }

  get accountType(): string {
    return this._accountType;
  }

  get balance(): MoneyObject {
    return this._balance;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get displayName(): string {
    return this._displayName;
  }

  get ownershipType(): OwnershipTypeEnum {
    return this._ownershipType;
  }

  get relationships(): AccountRelationships {
    return this._relationships;
  }
}
