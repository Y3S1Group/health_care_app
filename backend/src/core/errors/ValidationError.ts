import { AppError } from "./AppError";

export class ValidationError extends AppError {
    statusCode = 400;

    constructor(message: string = 'Validation failed') {
        super(message);
    }
}