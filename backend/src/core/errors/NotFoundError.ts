import { AppError } from "./AppError";

export class NotFoundError extends AppError {
    statusCode = 404;

    constructor(resource: string = 'Resource') {
        super(`${resource} not found`);
    }
}