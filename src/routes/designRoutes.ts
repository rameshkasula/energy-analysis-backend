import express from 'express';
import * as controller from '../controllers/designController';
// import { validateObjectId } from '../middlewares/validateObjectId';

const router = express.Router();

router.get('/', controller.getAllDesigns);
router.post('/', controller.createDesign);
router.get('/:id', controller.getDesignById);
router.put('/:id', controller.updateDesign);
router.patch('/:id/status', controller.updateDesignStatus);
router.delete('/:id', controller.softDeleteDesign);

export default router;
