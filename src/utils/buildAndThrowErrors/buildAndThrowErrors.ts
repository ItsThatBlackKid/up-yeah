import {UpErrorObject} from "../../client";
import {UpError, UpErrorCollection} from "../../errors";

export const buildAndThrowErrors = (e: any) => {
    const errors: UpErrorObject[] | undefined = e.response.data.errors;
    const collectedErrors: UpError[] = [];

    if (errors) {
        errors.forEach(err => {
            collectedErrors.push(new UpError(err.status, err.title, err.detail, err.source));
        });
    }

    throw new UpErrorCollection(collectedErrors);
}