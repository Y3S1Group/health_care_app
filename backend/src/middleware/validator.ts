import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { ValidationError } from "../core/errors/ValidationError";

export const validate = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errorMessage = error.details.map(d => d.message).join(', ');
            return next(new ValidationError(errorMessage));
        }

        req.body = value;
        next();
    }
}