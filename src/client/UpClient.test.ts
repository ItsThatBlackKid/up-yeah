import axios from 'axios';
import UpClient from './UpClient';

const createSpy = jest.spyOn(axios, 'create');

describe('Up Client', () => {
  it('should create axios instance with correct options', () => {
    const client = new UpClient({
      personalAccessToken: 'xyz',
    });

    expect(createSpy).toHaveBeenCalledWith({
      baseURL: 'https://api.up.com.au/api/v1',
      headers: {
        Authorization: `Bearer  xyz`,
      },
    });
  });
});
