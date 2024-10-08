/**
 * Created on 15/01/23
 */
import {UpError} from './UpError';
import {IUpError} from "./types";

export class UpErrorCollection extends Error {
	private readonly _errors: IUpError[];

	constructor(errors: IUpError[]) {
		super('Errors returned from API');

		// for why this is here, see: https://stackoverflow.com/questions/41102060/typescript-extending-error-class
		Object.setPrototypeOf(this, UpErrorCollection.prototype);

		this._errors = errors;
	}

	get errors(): IUpError[] {
		return this._errors;
	}

	public getFirstError(): IUpError {
		return this._errors[0];
	}
}
