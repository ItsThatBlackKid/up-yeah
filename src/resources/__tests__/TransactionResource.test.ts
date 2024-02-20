import {TransactionAttributes, TransactionRelationships, TransactionStatusEnum} from '../types';
import TransactionResource from "../Transactions/TransactionResource";

const mockAttributes: TransactionAttributes = {
    amount: {
        currencyCode: 'AUD',
        value: '12',
        valueInBaseUnits: 1200
    },
    createdAt: new Date(11122),
    description: "This is a transaction",
    isCategorizable: false,
    status: TransactionStatusEnum.SETTLED
}

const mockRelationShips: TransactionRelationships = {
    account: {
        data: {
            type: 'accounts',
            id: 'mockId'
        }
    },
}
describe('TransactionResource', () => {
    it('should build TransactionResource correctly', () => {
        const transaction: TransactionResource = new TransactionResource('1',
            mockAttributes,
            mockRelationShips
        )

        expect(transaction.id).toEqual('1')
        expect(transaction.createdAt).toEqual(new Date(11122))
        expect(transaction.status).toEqual('SETTLED')
        expect(transaction.description).toEqual("This is a transaction")
        expect(transaction.isCategorizable).toEqual(false)
        expect(transaction.amount).toEqual({
            currencyCode: 'AUD',
            value: '12',
            valueInBaseUnits: 1200
        });

        expect(transaction.relationships).toEqual(mockRelationShips)
        expect(transaction.type).toEqual('transactions')
    })
})