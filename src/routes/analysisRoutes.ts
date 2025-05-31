import express, { RequestHandler } from 'express';
import {
    analyzeDesign,
    getCachedAnalysis,
    compareDesigns,
} from '../controllers/analysisController';
// import { validateObjectId } from '../middlewares/validateObjectId';

const router = express.Router();

router.get('/compare', compareDesigns as RequestHandler);

// Group analysis operations under /:designId/analyze
router.post('/:designId/analyze', analyzeDesign as RequestHandler);
router.get('/:designId/analyze', getCachedAnalysis as RequestHandler);

export default router;
