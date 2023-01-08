import mockAxios from 'jest-mock-axios';
import UpClient from './UpClient';


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
        it('should make GET call to /accounts when invoked',async () => {
            mockAxios.get.mockResolvedValue({
                data: {
                    data: []
                }
            })

            const client = new UpClient({
                personalAccessToken: 'xyz'
            });

            await client.getAccounts();

            expect(mockAxios.get).toHaveBeenCalledWith('/accounts')
        });
    });
});
