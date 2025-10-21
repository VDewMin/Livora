import express from "express";
import { createNotification, getAllUserNotifications, markAsRead, markAllAsRead, getUserNotificationsSidebar } from "../controllers/vd_notificationController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/:userId/sidebar", getUserNotificationsSidebar);
router.get("/:userId", getAllUserNotifications);
router.patch("/:id/mark-read", markAsRead);
router.put("/user/:userId/mark-read", markAllAsRead);

export default router;
