import { Request, Response } from 'express';
import { handleSuccess, handleError } from '../utils/responseHandler';
import * as service from '../services/electricityRateService';

export const createRate = async (req: Request, res: Response) => {
    try {
        const result = await service.createRate(req.body);
        handleSuccess(res, result, 201);
    } catch (err) {
        handleError(res, err);
    }
};

export const getAllRates = async (req: Request, res: Response) => {
    try {
        const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

        const result = await service.getAllRates(skip, limit);
        handleSuccess(res, result);
    } catch (err) {
        handleError(res, err);
    }
};

export const getRateById = async (req: Request, res: Response) => {
    try {
        const result = await service.getRateById(req.params.id);
        handleSuccess(res, result);
    } catch (err) {
        handleError(res, err);
    }
};

export const updateRate = async (req: Request, res: Response) => {
    try {
        const result = await service.updateRate(req.params.id, req.body);
        handleSuccess(res, result);
    } catch (err) {
        handleError(res, err);
    }
};

export const deleteRate = async (req: Request, res: Response) => {
    try {
        const result = await service.deleteRate(req.params.id);
        handleSuccess(res, {
            message: 'Rate deleted successfully',
            data: result
        }, 200);
    } catch (err) {
        handleError(res, err);
    }
};

export const getActiveRates = async (req: Request, res: Response) => {
    try {
        const result = await service.getActiveRates();
        handleSuccess(res, result);
    } catch (err) {
        handleError(res, err);
    }
};

export const getRateByCity = async (req: Request, res: Response) => {
    try {
        const { city } = req.params;
        const result = await service.getRateByCity(city);
        handleSuccess(res, result);
    } catch (err) {
        handleError(res, err);
    }
}; 