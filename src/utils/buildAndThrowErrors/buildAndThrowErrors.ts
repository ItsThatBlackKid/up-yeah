import {ErrorObject} from "../../client";
import UpError from "../../errors/UpError";
import UpErrorCollection from "../../errors/UpErrorCollection";

export const buildAndThrowErrors = (e: any) => {
    const errors: ErrorObject[] | undefined = e.response.data.errors;
    const collectedErrors: UpError[] = [];

    if (errors) {
        errors.forEach(err => {
            collectedErrors.push(new UpError(err.status, err.title, err.detail, err.source));
        });
    }

    throw new UpErrorCollection(collectedErrors);
}