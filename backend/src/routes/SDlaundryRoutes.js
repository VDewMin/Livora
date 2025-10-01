import express from 'express';
import { createLaundryRequest, getAllLaundryRequests, getLaundryRequestByScheduleId, updateLaundryRequest, deleteLaundryRequest,getLaundryRequestById } from '../controllers/SDlaundryController.js';

const router = express.Router();

router.get('/', getAllLaundryRequests);
router.get('/:id', getLaundryRequestById);
router.get('/schedule/:schedule_id', getLaundryRequestByScheduleId);
router.post('/', createLaundryRequest);
router.put('/:id', updateLaundryRequest);
router.delete('/:id', deleteLaundryRequest);

export default router;