import { IUpError } from '../types';
import {UpErrorCollection} from '../UpErrorCollection';

describe('UpErrorCollection', () => {
	it('should store errors in error variable', () => {
		const error: IUpError = {
			status: '400',
			title: 'Bad request data',
			detail: 'The request data provided was invalid',
			source: {
				parameter: 'x',
				pointer: '0',
			},
		};

		const collection = new UpErrorCollection([error]);

		expect(collection.errors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					detail: 'The request data provided was invalid',
					source: {
						parameter: 'x',
						pointer: '0',
					},
					status: '400',
					title: 'Bad request data',
				}),
			]),
		);
	});
});
