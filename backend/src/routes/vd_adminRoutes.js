import express from "express";
import { 
  getAdminStats, 
  getBookingTrends, 
  getRevenueData, 
  getServiceDistribution, 
  getRecentActivities 
} from "../controllers/vd_adminController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Admin dashboard routes
router.get("/stats", getAdminStats);
router.get("/booking-trends", getBookingTrends);
router.get("/revenue-data", getRevenueData);
router.get("/service-distribution", getServiceDistribution);
router.get("/recent-activities", getRecentActivities);

export default router;
