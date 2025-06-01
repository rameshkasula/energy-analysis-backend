import { Request, Response } from 'express';
import { handleSuccess, handleError } from '../utils/responseHandler';
import * as service from '../services/designService';

export const createDesign = async (req: Request, res: Response) => {
    try {
        const result = await service.createDesign(req.body);
        handleSuccess(res, result, 201);
    } catch (err) {
        handleError(res, err);
    }
};

export const getAllDesigns = async (req: Request, res: Response) => {
    try {
        const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

        const result = await service.getAllDesigns(skip, limit);
        handleSuccess(res, result);
    } catch (err) {
        handleError(res, err);
    }
};

export const getDesignById = async (req: Request, res: Response) => {
    try {
        const result = await service.getDesignById(req.params.id);
        handleSuccess(res, result);
    } catch (err) {
        handleError(res, err);
    }
};

export const updateDesign = async (req: Request, res: Response) => {
    try {
        const result = await service.updateDesign(req.params.id, req.body);
        handleSuccess(res, result);
    } catch (err) {
        handleError(res, err);
    }
};

export const updateDesignStatus = async (req: Request, res: Response) => {
    try {
        const result = await service.updateDesignStatus(req.params.id, req.body.status);
        handleSuccess(res, result);
    } catch (err) {
        handleError(res, err);
    }
};

export const softDeleteDesign = async (req: Request, res: Response) => {
    try {
        const result = await service.softDeleteDesign(req.params.id);
        handleSuccess(res, result, 204);
    } catch (err) {
        handleError(res, err);
    }
};

// get design based on the city level
export const getDesignByCity = async (req: Request, res: Response) => {
    try {
        // query params city
        const city = req.query.city as string;
        const result = await service.getDesignByCity(city);
        handleSuccess(res, result);
    } catch (err) {
        handleError(res, err);
    }
};