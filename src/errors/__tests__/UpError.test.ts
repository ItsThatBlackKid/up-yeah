import UpError from '../UpError';

describe('UpError',  () => {

    it('should build class correctly', () => {
        const error = new UpError('400', 'Bad request data', 'The request data provided was invalid', {
            parameter: 'x',
            pointer: '0'
        });


        expect(error.status).toEqual('400')
        expect(error.title).toEqual('Bad request data')
        expect(error.detail).toEqual('The request data provided was invalid')
        expect(error.source).toEqual({
            parameter: 'x',
            pointer: '0'
        });
        expect(error.message).toEqual('400 - Bad request data')
    });
});