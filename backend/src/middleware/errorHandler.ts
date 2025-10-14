import { Request, Response, NextFunction } from "express";
import { AppError } from "../core/errors/AppError";
import { logger } from "../config/logger";

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    logger.error(`${err.name}: ${err.message}`);

    //custom app error
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: {
                name: err.name,
                message: err.message
            }
        });
        return;
    }

    //Mongoose validation error
    if(err.name == 'ValidationError') {
        res.status(400).json({
            success: false,
            error: {
                name: 'ValidationError',
                message: err.message
            }
        });
        return;
    }

    //JWT errors
    if(err.name == 'JsonWebTokenError') {
        res.status(400).json({
            success: false,
            error: {
                name: 'JsonWebTokenError',
                message: 'Invalid token'
            }
        });
        return;
    }

    res.status(500).json({
        success: false,
        error: {
            name: 'InternalServerError',
            message: 'An unexpected error occurred'
        }
    }); 
}