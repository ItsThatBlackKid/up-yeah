import {TransactionAttributesResponse, TransactionResponse} from '../client/types';
import {TransactionStatusEnum} from '../resources/types';

export const mockTransactionAttributes: TransactionAttributesResponse = {
    amount: {
        currencyCode: 'AUD',
        value: '4.20',
        valueInBaseUnits: 420
    },
    createdAt: '2023-07-18T07:44:17+10:00',
    description: "This is a transaction",
    isCategorizable: false,
    status: TransactionStatusEnum.SETTLED

}

export const mockTransactionResponse: TransactionResponse = {
    attributes: mockTransactionAttributes,
    id: "mockId",
    links: {},
    relationships: {
        account: {}
    },
    type: "transactions"
}

export const mockListTransactionsResponse = {
    data: {
        data:  [mockTransactionResponse]
    },
    links: {
        prev: null,
        next: null
    }
}