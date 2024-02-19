import AccountResource from '../resources/Account/AccountResource';
import {AccountResourceResponse} from '../client/types';
import {AccountTypeEnum, OwnershipTypeEnum} from '../resources/types';

export const buildAccount = (account:  AccountResourceResponse): AccountResource => {
    const {id, attributes, relationships} = account;
    const ownerShipType: OwnershipTypeEnum = account.attributes.ownershipType as OwnershipTypeEnum;
    return new AccountResource(id, {
        ...attributes,
        accountType: attributes.accountType as AccountTypeEnum,
        createdAt: new Date(attributes.createdAt),
        ownershipType: attributes.ownershipType as OwnershipTypeEnum,
    }, relationships);
}

export const buildAccounts = (accounts: AccountResourceResponse[]): AccountResource[] => {
    if(!accounts || accounts.length === 0) {
        return []
    }
    const resources: AccountResource[] = [];
    accounts.forEach(account => {
        resources.push(buildAccount(account));
    })

    return resources;
}