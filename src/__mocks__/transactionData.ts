import {ListTransactionResponse, TransactionAttributesResponse, TransactionResponse} from '../client/types';
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

export const mockTransactionAttributes2: TransactionAttributesResponse = {
    amount: {
        currencyCode: 'AUD',
        value: '6.9',
        valueInBaseUnits: 690
    },
    createdAt: '2023-07-18T07:44:17+10:00',
    description: "This is another transaction",
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
        data:  [mockTransactionResponse],
        links: {
            prev: null,
            next: null
        }
    },
}

export const mockListTransactionsMultiResponse = {
    data: {
        data: [mockTransactionResponse, {
            ...mockTransactionResponse,
            attributes: mockTransactionAttributes2
        }],
        links: {
            prev: null,
            next: 'http://some.up.au/api/v1/transaction/endpoint/2'
        }
    }
}


export const mockUpGetTransactionsEmpty: {data: ListTransactionResponse} = {
    data: {
        data: [],
        links: {
            prev: null,
            next: null
        }
    }
}