import express from 'express';
import * as solarRadiationController from '../controllers/solarRadiationController';
import { validateSolarRadiation, validateStatusUpdate } from '../middlewares/validationMiddleware';

const router = express.Router();

// Base routes
router.post('/', validateSolarRadiation as express.RequestHandler, solarRadiationController.createRadiation as express.RequestHandler);
router.get('/', solarRadiationController.getAllRadiation);
router.get('/active', solarRadiationController.getActiveRadiation);

// City-specific routes
router.get('/city/:city', solarRadiationController.getRadiationByCity);

// ID-specific routes
router.get('/:id', solarRadiationController.getRadiationById);
router.put('/:id', validateSolarRadiation as express.RequestHandler, solarRadiationController.updateRadiation as express.RequestHandler);
router.delete('/:id', solarRadiationController.deleteRadiation);

// Status management routes
router.patch('/:id/status', validateStatusUpdate as express.RequestHandler, solarRadiationController.updateRadiationStatus as express.RequestHandler);
router.patch('/:id/toggle-active', solarRadiationController.toggleRadiationActive as express.RequestHandler);

export default router; 