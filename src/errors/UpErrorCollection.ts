/**
 * Created on 15/01/23
 */
import UpError from './UpError';

export default class UpErrorCollection extends Error {
  private readonly _errors: UpError[];

  constructor(errors: UpError[]) {
    super('Errors returned from API');

    // for why this is here, see: https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, UpErrorCollection.prototype);

    this._errors = errors;
  }

  get errors(): UpError[] {
    return this._errors;
  }

  public getFirstError(): UpError {
    return this._errors[0];
  }
}
