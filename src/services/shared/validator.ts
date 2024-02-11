export class JSONError extends Error {}

export class BadRequestError extends Error {}

export class IncorrectTypeError extends Error {
    constructor(fieldName: string, argValue: string, allowedValues: string[], type ) {
        super(`The value ${argValue} is not correct. The value for ${fieldName} should be ${allowedValues.toString()} in ${type}.`);
    }
}

export class NotFoundError extends Error {}

export class InvalidIdError extends Error {}

export const validateIdAsNumber = (id: any) => {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
        throw new InvalidIdError();
    }
}