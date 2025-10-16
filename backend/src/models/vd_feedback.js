import mongoose from "mongoose";
import Counter from "./counter.js";

const feedbackSchema = new mongoose.Schema({
  feedbackId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  residentId: { type: String },

  feedbackType: {
    type: String,
    enum: ["Complaint", "Suggestion", "Request", "Compliment"],
    required: true,
  },

  feedbackAbout: {
    type: String,
    enum: ["Maintenance", "Services", "Bookings", "Deliveries", "Billing", "Other"],
    required: true,
  },

  message: { type: String, required: true },
  reply: { type: String, default: "" },
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Resolved"],
    default: "Pending",
  },
  feedbackDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Feedback Id
feedbackSchema.pre("save", async function (next) {
  try {
    if (!this.feedbackId) {
      const prefix = "FB";
      let counter = await Counter.findOne({ name: prefix });
      if (!counter) {
        counter = await Counter.create({ name: prefix, seq: 0 });
      }

      counter.seq += 1;
      await counter.save();

      this.feedbackId = prefix + counter.seq.toString().padStart(3, "0");
    }
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Feedback", feedbackSchema);
