import mockAxios from '../../__mocks__/axios';
import ResourceCollection from '../ResourceCollection';
import axios, {AxiosInstance} from 'axios';
import AccountResource from '../Account/AccountResource';
import {ResponseLinks} from '../../types';
import {mockAccountResponse, mockUpAccountsResponse} from '../../__mocks__/accountData';
import {AccountTypeEnum, OwnershipTypeEnum} from '../types';

describe('ResourceLink', () => {
    it('should set prevLink and nextLink when constructed', () => {
        const resourceLinks: ResponseLinks = {
            prev: 'https://up.com.au/api/v1/accounts',
            next: 'https://up.com.au/api/v1/accounts'
        }
        const resourceLink = new ResourceCollection([], resourceLinks,  mockAxios as unknown as AxiosInstance);

        expect(resourceLink.prevLink).toEqual('https://up.com.au/api/v1/accounts')
        expect(resourceLink.nextLink).toEqual('https://up.com.au/api/v1/accounts')
    });


    describe('next', () => {
        it('should return next set of resources  on success', async() => {
            mockAxios.get.mockResolvedValue({
                data: mockUpAccountsResponse
            });

            const collection = new ResourceCollection<AccountResource>([], {
                prev: null,
                next: 'http://some.up.au/api/v1/account/endpoint/1'
            }, mockAxios as unknown as AxiosInstance);

            await collection.next();

            const expectedAccountResource = new AccountResource('mockId', {
                displayName: 'up-yeah',
                accountType: AccountTypeEnum.TRANSACTIONAL,
                balance: {
                    currencyCode: 'AUD',
                    value: '4.20',
                    valueInBaseUnits: 420
                },
                createdAt: new Date('2021-09-23T01:12:00+10:00'),
                ownershipType: OwnershipTypeEnum.INDIVIDUAL
            }, {
                transactions: {
                    data: []
                }
            });

            expect(collection.resources).toEqual([
                expectedAccountResource
            ]);
        })
    })
})