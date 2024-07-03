import AccountResource from "../../resources/Account/AccountResource";
import {AccountAttributes, AccountTypeEnum, OwnershipTypeEnum} from "../../resources/types";
import {AccountRelationships} from "../../types";

const mockAccountAttributes: AccountAttributes = {
    displayName: 'up-yeah',
    accountType: AccountTypeEnum.TRANSACTIONAL,
    balance: {
        currencyCode: 'AUD',
        value: '4.20',
        valueInBaseUnits: 420,
    },
    createdAt: new Date('2021-09-23T01:12:00+10:00'),
    ownershipType: OwnershipTypeEnum.INDIVIDUAL,
}

const mockAccountRelationships: AccountRelationships = {
    transactions: {
        data: [],
    },
}

const mockAccountId = 'mockId';

export const mockAccountResource = new AccountResource(
    mockAccountId,
    mockAccountAttributes,
    mockAccountRelationships
);

export const mockAccountResource2 = new AccountResource(
    'mockId2',
    mockAccountAttributes,
    mockAccountRelationships
);

const createMockAccount = (id: string, attributes: AccountAttributes, relationships: AccountRelationships) => {
    return new AccountResource(id, attributes, relationships);
}

const createMockAccounts = (override: [AccountResource]): AccountResource[] => {
    return [
        mockAccountResource,
        mockAccountResource2
    ]
}