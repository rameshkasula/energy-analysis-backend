import { Response } from 'express';
import { handleError as handleAppError } from './errorHandler';

export const handleSuccess = (res: Response, data: any, statusCode: number = 200) => {
    res.status(statusCode).json({
        success: true,
        data
    });
};

export const handleError = (res: Response, error: any) => {
    handleAppError(res, error);
};

export const handlePagination = (res: Response, data: any[], total: number, page: number, limit: number) => {
    res.json({
        success: true,
        data,
        total,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    });
};
