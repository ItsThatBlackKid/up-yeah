import {AccountRelationships} from '../../types'
import AccountResource from '../AccountResource'
import {AccountAttributes, AccountTypeEnum, OwnershipTypeEnum} from '../types'

const mockAttributes: AccountAttributes = {
    displayName: 'test',
    accountType: AccountTypeEnum.SAVER,
    ownershipType: OwnershipTypeEnum.INDIVIDUAL,
    balance: {
        currencyCode: 'AUD',
        value: '12',
        valueInBaseUnits: 1200
    },
    createdAt: new Date(11122)
}

const mockRelationShips: AccountRelationships = {
    transactions: {
        data: [{resourceType: 'transactions', id: 'mockId'}],
        links: undefined
    }
}
describe('AccountResource', () => {
    it('should build AccountResource correctly', () => {
        const acc: AccountResource = new AccountResource('1',
            mockAttributes,
            mockRelationShips
        )

        expect(acc.id).toEqual('1')
        expect(acc.createdAt).toEqual(new Date(11122))
        expect(acc.accountType).toEqual('SAVER')
        expect(acc.displayName).toEqual('test')
        expect(acc.ownershipType).toEqual(OwnershipTypeEnum.INDIVIDUAL)
        expect(acc.balance).toEqual({
            currencyCode: 'AUD',
            value: '12',
            valueInBaseUnits: 1200
        });

        expect(acc.relationships).toEqual(mockRelationShips)
        expect(acc.resourceType).toEqual('accounts')
    })
})