import express from "express";
import { getAllBookings, getBookingById, createBooking, updateBooking, updateBookingStatus, deleteBooking } from "../controllers/SDConventionHallBookingController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.post("/", authMiddleware, createBooking);
router.put("/:id", authMiddleware, updateBooking);
router.delete("/:id", authMiddleware, deleteBooking);
router.put("/:id/status", authMiddleware, updateBookingStatus);

export default router;