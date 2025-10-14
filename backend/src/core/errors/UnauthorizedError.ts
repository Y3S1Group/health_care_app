import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
    statusCode = 401;

    constructor(message: string = 'Unauthorized Access') {
        super(message);
    }
}