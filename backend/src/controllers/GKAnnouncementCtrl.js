import Announcement from "../models/GKAnnouncements.js";

//Create new announcement (Admin only)
export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, date } = req.body;
    if (!title || !message || !date) {
      return res.status(400).json({ error: "Title, message, and date are required" });
    }

    const announcement = new Announcement({ title, message, date });
    await announcement.save();

    // In real-world, you could also push to FCM/Socket.io for realtime notification
    res.status(201).json({ message: "Announcement created", announcement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all announcements (Residents & Admin)
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
