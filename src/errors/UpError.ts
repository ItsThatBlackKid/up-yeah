/**
 * Created on 9/01/23
 * Doc ref: https://developer.up.com.au/#error-responses
 * By Sao Kanneh
 */
import { ErrorSource } from './types';

export interface IUpError {
  status: string;
  title: string;
  detail: string;
  source?: ErrorSource;
}

export default class UpError extends Error implements IUpError{
  private readonly _status: string;
  private readonly _title: string;
  private readonly _detail: string;
  private readonly _source: ErrorSource;
  constructor(status: string, title: string, detail: string, source: ErrorSource = {}) {
    super(`${status} - ${title}`);

    // for why this is here, see: https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, UpError.prototype);

    this._status = status;
    this._title = title;
    this._detail = detail;
    this._source = source;
  }

  get status(): string {
    return this._status;
  }

  get title(): string {
    return this._title;
  }

  get detail(): string {
    return this._detail;
  }

  get source(): ErrorSource {
    return this._source;
  }
}
