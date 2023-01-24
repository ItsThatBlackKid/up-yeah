import UpError from '../UpError';
import UpErrorCollection from '../UpErrorCollection';

describe('UpErrorCollection', () => {

    it('should store errors in error variable', () => {
        const error = new UpError('400', 'Bad request data', 'The request data provided was invalid', {
            parameter: 'x',
            pointer: '0',
        });

        const collection = new UpErrorCollection([error]);

        expect(collection.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({
                    _detail: "The request data provided was invalid",
                    _source: {
                        parameter: "x",
                        pointer: "0"
                    },
                    _status: "400",
                    _title: "Bad request data"
                }
            )
        ]));
    });
});