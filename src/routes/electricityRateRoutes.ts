import express from 'express';
import {
    createRate,
    getAllRates,
    getRateById,
    updateRate,
    deleteRate,
    getActiveRates,
    getRateByCity
} from '../controllers/electricityRateController';

const router = express.Router();

router.post('/', createRate);
router.get('/', getAllRates);
router.get('/active', getActiveRates);
router.get('/city/:city', getRateByCity);
router.get('/:id', getRateById);
router.put('/:id', updateRate);
router.delete('/:id', deleteRate);

export default router; 