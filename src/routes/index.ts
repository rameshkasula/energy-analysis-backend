// Import all routes
import express from 'express';

import designRoutes from './designRoutes';
import analysisRoutes from './analysisRoutes';
import electricityRateRoutes from './electricityRateRoutes';
import solarRadiationRoutes from './solarRadiationRoutes';

const router = express.Router();

// Use all routes
router.use('/designs', designRoutes);
router.use('/analysis', analysisRoutes);
router.use('/electricity-rates', electricityRateRoutes);
router.use('/solar-radiation', solarRadiationRoutes);

export default router;
