import express from 'express';
import {getAllBookings,getBookingById,createBooking,updateBooking,updateBookingStatus,deleteBooking,} from '../controllers/SDConventionHallBookingController.js';

const router = express.Router();

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.put('/:id/status', updateBookingStatus);


export default router;