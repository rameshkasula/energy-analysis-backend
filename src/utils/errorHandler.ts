import { Response } from 'express';

// Custom error class for application-specific errors
export class AppError extends Error {
    statusCode: number;
    errorCode: string;

    constructor(message: string, statusCode: number = 500, errorCode: string = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}

// Common error codes and messages
export const ErrorCodes = {
    DUPLICATE_RECORD: {
        code: 'DUPLICATE_RECORD',
        message: 'A record with this information already exists',
        status: 409
    },
    NOT_FOUND: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found',
        status: 404
    },
    VALIDATION_ERROR: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        status: 400
    },
    UNAUTHORIZED: {
        code: 'UNAUTHORIZED',
        message: 'Unauthorized access',
        status: 401
    },
    FORBIDDEN: {
        code: 'FORBIDDEN',
        message: 'Access forbidden',
        status: 403
    }
};

// Handle MongoDB duplicate key error
export const handleDuplicateKeyError = (error: any): AppError => {
    const field = Object.keys(error.keyPattern)[0];
    return new AppError(
        `A record with this ${field} already exists`,
        ErrorCodes.DUPLICATE_RECORD.status,
        ErrorCodes.DUPLICATE_RECORD.code
    );
};

// Handle MongoDB validation error
export const handleValidationError = (error: any): AppError => {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    return new AppError(
        `Invalid input: ${errors.join('. ')}`,
        ErrorCodes.VALIDATION_ERROR.status,
        ErrorCodes.VALIDATION_ERROR.code
    );
};

// Main error handler
export const handleError = (res: Response, error: any) => {
    console.error('Error:', error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
        const appError = handleDuplicateKeyError(error);
        return res.status(appError.statusCode).json({
            success: false,
            error: {
                code: appError.errorCode,
                message: appError.message
            }
        });
    }

    // Handle MongoDB validation error
    if (error.name === 'ValidationError') {
        const appError = handleValidationError(error);
        return res.status(appError.statusCode).json({
            success: false,
            error: {
                code: appError.errorCode,
                message: appError.message
            }
        });
    }

    // Handle custom AppError
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            error: {
                code: error.errorCode,
                message: error.message
            }
        });
    }

    // Handle unknown errors
    return res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: error.message || 'An unexpected error occurred',
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        }
    });
}; 