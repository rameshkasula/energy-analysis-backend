import { Response } from 'express';

export const handleSuccess = (res: Response, data: any, statusCode: number = 200) => {
    res.status(statusCode).json({
        success: true,
        data
    });
};

export const handleError = (res: Response, error: any, statusCode: number = 500) => {
    res.status(statusCode).json({
        success: false,
        error: {
            message: error.message || 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        }
    });
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
