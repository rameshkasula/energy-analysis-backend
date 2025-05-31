import { Request, Response, NextFunction } from 'express';

export const validateSolarRadiation = (req: Request, res: Response, next: NextFunction) => {
    const { city, radiation, status } = req.body;

    // Validate city
    if (!city || typeof city !== 'string' || city.trim().length === 0) {
        return res.status(400).json({ message: 'City name is required and must be a non-empty string' });
    }

    // Validate radiation data
    if (!radiation || typeof radiation !== 'object') {
        return res.status(400).json({ message: 'Radiation data is required' });
    }

    const { north, south, east, west, roof } = radiation;
    const directions = { north, south, east, west, roof };

    for (const [direction, value] of Object.entries(directions)) {
        if (typeof value !== 'number' || value < 0) {
            return res.status(400).json({
                message: `Invalid radiation value for ${direction}. Must be a non-negative number`
            });
        }
    }

    // Validate status if provided
    if (status && !['DRAFT', 'REVIEW', 'FINALIZED'].includes(status)) {
        return res.status(400).json({
            message: 'Invalid status. Must be one of: DRAFT, REVIEW, FINALIZED'
        });
    }

    next();
};

export const validateStatusUpdate = (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;

    if (!status || !['DRAFT', 'REVIEW', 'FINALIZED'].includes(status)) {
        return res.status(400).json({
            message: 'Invalid status. Must be one of: DRAFT, REVIEW, FINALIZED'
        });
    }

    next();
}; 