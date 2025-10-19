import Feedback from "../models/vd_feedback.js";
import Notification from "../models/vd_notification.js";
import { emitNotification } from "../utils/vd_emitNotification.js";

// Resident: Create feedback
export const createFeedback = async (req, res) => {
  try {
    const { feedbackType, feedbackAbout, message, feedbackDate } = req.body;

    // ✅ Extract user info from req.user (set by authMiddleware)
    const userId = req.user._id;
    const residentId = req.user.userId; // custom app-level ID

    const newFeedback = new Feedback({
      userId,
      residentId,
      feedbackType,
      feedbackAbout,
      message,
      feedbackDate,
    });
    await newFeedback.save();

    // ✅ Create notification
    const notification = {
      userId: userId.toString(),
      title: "Feedback Submitted",
      message: `You submitted a new ${feedbackType.toLowerCase()} regarding ${feedbackAbout}.`,
      createdAt: new Date(),
      isRead: false,
    };

    await Notification.create(notification);
    emitNotification(notification);

    res.status(201).json({ success: true, message: "Feedback submitted successfully!" });

  } catch (err) {
    console.error("Error creating feedback:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// 👤 Resident: View their feedbacks
export const getUserFeedbacks = async (req, res) => {
  try {
    const userId = req.user.id;
    const feedbacks = await Feedback.find({ userId }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🛠️ Admin: View all feedbacks (with optional filters)
export const getAllFeedbacks = async (req, res) => {
  try {
    const { feedbackType, feedbackAbout, from, to } = req.query;

    const query = {};
    if (feedbackType) query.feedbackType = feedbackType;
    if (feedbackAbout) query.feedbackAbout = feedbackAbout;
    if (from || to) {
      query.feedbackDate = {};
      if (from) query.feedbackDate.$gte = new Date(from);
      if (to) query.feedbackDate.$lte = new Date(new Date(to).setHours(23,59,59,999));
    }

    const feedbacks = await Feedback.find(query)
      .populate("userId", "firstName lastName email role userId")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🧩 Admin: Reply or update feedback
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply, status } = req.body;

    const updated = await Feedback.findByIdAndUpdate(id, { reply, status }, { new: true });
    res.json({ success: true, feedback: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🗑️ Admin: Delete feedback
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await Feedback.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
