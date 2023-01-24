import mockAxios from 'jest-mock-axios';
import UpClient from '../UpClient';
import AccountResource from '../../resources/AccountResource';
import { OwnershipTypeEnum } from '../../resources/types';
import UpError from '../../errors/UpError';

const mockUpAccountsResponse = {
  data: {
    data: [
      {
        type: 'accounts',
        id: 'mockId',
        attributes: {
          displayName: 'up-yeah',
          accountType: 'TRANSACTIONAL',
          ownershipType: 'INDIVIDUAL',
          balance: {
            currencyCode: 'AUD',
            value: '4.20',
            valueInBaseUnits: 420,
          },
          createdAt: '2021-09-23T01:12:00+10:00',
        },
        relationships: {
          transactions: {},
        },
      },
    ],
  },
  links: {
    prev: null,
    next: null,
  },
};

describe('Up Client', () => {
  it('should create axios instance with correct options', () => {
    // tslint:disable-next-line:no-unused-expression
    new UpClient({
      personalAccessToken: 'xyz',
    });
    expect(mockAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://api.up.com.au/api/v1',
      headers: {
        Authorization: `Bearer  xyz`,
      },
    });
  });

  describe('getAccounts', () => {
    it('should make GET call to /accounts when invoked', async () => {
      mockAxios.get.mockResolvedValue({
        data: {
          data: [],
        },
      });

      const client = new UpClient({
        personalAccessToken: 'xyz',
      });

      await client.getAccounts();

      expect(mockAxios.get).toHaveBeenCalledWith('/accounts');
    });

    it('should return accounts found in response data', async () => {
      mockAxios.get.mockResolvedValue(mockUpAccountsResponse);

      const client = new UpClient({
        personalAccessToken: 'xyz',
      });

      const accounts = await client.getAccounts();

      const expectedAccountResource = new AccountResource(
        'mockId',
        {
          displayName: 'up-yeah',
          accountType: 'TRANSACTIONAL',
          balance: {
            currencyCode: 'AUD',
            value: '4.20',
            valueInBaseUnits: 420,
          },
          createdAt: new Date('2021-09-23T01:12:00+10:00'),
          ownershipType: OwnershipTypeEnum.INDIVIDUAL,
        },
        {
          transactions: {},
        },
      );

      expect(accounts[0]).toEqual(expectedAccountResource);
    });

    it('should throw UpError if api returns an error', async () => {
      mockAxios.get.mockRejectedValue({
        response: {
          data: [
            {
              status: '400',
              title: 'Bad request',
              detail: 'Some of the information provided is invalid',
              source: {
                paramter: 'x',
                pointer: '0',
              },
            },
          ],
        },
      });
      try {
        const client = new UpClient({
          personalAccessToken: 'xyz',
        });

        await client.getAccounts();
      } catch (e) {

      }
    });
  });
});
