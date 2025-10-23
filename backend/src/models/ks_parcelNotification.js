import mongoose from "mongoose";

const parcelNotificationLogSchema = new mongoose.Schema({
  parcelId: { type: String, required: true },
  type: { type: String, enum: ["4day", "10day", "14day"], required: true },
  sentAt: { type: Date, default: Date.now },
});

const ParcelNotificationLog = mongoose.model(
  "ParcelNotificationLog",
  parcelNotificationLogSchema
);

export default ParcelNotificationLog;
