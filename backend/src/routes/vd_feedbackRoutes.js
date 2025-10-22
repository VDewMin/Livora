import express from "express";
import {
  createFeedback,
  getUserFeedbacks,
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback,
  sendFeedbackReply,
} from "../controllers/vd_feedbackController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// admin guard
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "Admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// Resident routes
router.post("/", authMiddleware, createFeedback);
router.get("/my-feedbacks", authMiddleware, getUserFeedbacks);

// Admin routes
router.get("/", authMiddleware, adminOnly, getAllFeedbacks);
router.patch("/:id", authMiddleware, adminOnly, updateFeedback);
router.delete("/:id", authMiddleware, adminOnly, deleteFeedback);
router.post("/reply/:feedbackId", sendFeedbackReply);


export default router;
