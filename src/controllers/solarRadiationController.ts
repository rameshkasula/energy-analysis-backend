import { Request, Response } from 'express';
import * as solarRadiationService from '../services/solarRadiationService';
import { handleSuccess, handleError, handlePagination } from '../utils/responseHandler';

export const createRadiation = async (req: Request, res: Response) => {
    try {
        const radiation = await solarRadiationService.createRadiation(req.body);
        handleSuccess(res, radiation, 201);
    } catch (error: any) {
        handleError(res, error, 400);
    }
};

export const getAllRadiation = async (req: Request, res: Response) => {
    try {

        const limit = parseInt(req.query.limit as string) || 10;
        const skip = parseInt(req.query.skip as string) || 0;

        const result = await solarRadiationService.getAllRadiation(skip, limit);
        handleSuccess(res, result);
    } catch (error: any) {
        handleError(res, error);
    }
};

export const getRadiationById = async (req: Request, res: Response) => {
    try {
        const radiation = await solarRadiationService.getRadiationById(req.params.id);
        handleSuccess(res, radiation);
    } catch (error: any) {
        handleError(res, error, 404);
    }
};

export const updateRadiation = async (req: Request, res: Response) => {
    try {
        const radiation = await solarRadiationService.updateRadiation(req.params.id, req.body);
        handleSuccess(res, radiation);
    } catch (error: any) {
        handleError(res, error, 400);
    }
};

export const deleteRadiation = async (req: Request, res: Response) => {
    try {
        await solarRadiationService.deleteRadiation(req.params.id);
        handleSuccess(res, {
            message: 'Radiation deleted successfully',
        }, 200);
    } catch (error: any) {
        handleError(res, error, 404);
    }
};

export const getActiveRadiation = async (req: Request, res: Response) => {
    try {
        const radiation = await solarRadiationService.getActiveRadiation();
        handleSuccess(res, radiation);
    } catch (error: any) {
        handleError(res, error);
    }
};

export const getRadiationByCity = async (req: Request, res: Response) => {
    try {
        const radiation = await solarRadiationService.getRadiationByCity(req.params.city);
        handleSuccess(res, radiation);
    } catch (error: any) {
        handleError(res, error, 404);
    }
};

export const updateRadiationStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const radiation = await solarRadiationService.updateRadiationStatus(req.params.id, status);
        handleSuccess(res, radiation);
    } catch (error: any) {
        handleError(res, error, 400);
    }
};

export const toggleRadiationActive = async (req: Request, res: Response) => {
    try {
        const radiation = await solarRadiationService.toggleRadiationActive(req.params.id);
        handleSuccess(res, radiation);
    } catch (error: any) {
        handleError(res, error, 400);
    }
}; 