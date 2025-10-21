import Notification from "../models/vd_notification.js";

// Create a new notification
export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    const notification = await Notification.create({ userId, title, message, type });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all notifications for a user
export const getUserNotificationsSidebar = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }
    

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 }) // newest first
      .limit(5); // only latest 5

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    // Fetch all notifications for this user, sorted newest first
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching all notifications:", err);
    res.status(500).json({ error: err.message });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark all notifications for a user as read
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

