import mongoose from "mongoose";

const GKServiceRequestSchema = new mongoose.Schema({
  aptNo: { type: String, required: true },
  roomId: { type: String, required: true },
  contactNo: { type: String, required: true },
  serviceType: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
  assignedTechnician: { type: String, default: "" },
  status: {
      type: String,
      enum: ["Pending", "In Processing", "Completed"],
      default: "Pending",
    },
},
    { timestamps: true } //createdAt, updateAt
);

const GKServiceRequest  = mongoose.model("GKServiceRequest", GKServiceRequestSchema);

export default GKServiceRequest ;