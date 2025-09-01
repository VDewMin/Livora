import mongoose from "mongoose";
import Counter from "./counter.js";

const GKServiceRequestSchema = new mongoose.Schema({
  aptNo: { type: String, required: true },
  serviceId: { type: String, unique: true },
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
GKServiceRequestSchema.pre("save", async function (next) {
  try {
    // Only generate parcelId if it is not already set
    if (!this.serviceId) {
      let counter = await Counter.findOne({ name: "service" });
      
      // Initialize counter if missing
      if (!counter) {
        counter = await Counter.create({ name: "service", seq: 0 });
      }

      // Increment counter
      counter.seq += 1;
      await counter.save();

      // Set parcelId
      this.serviceId = "S" + counter.seq.toString().padStart(3, "0");
    }

    next();
  } catch (err) {
    console.error("Error in pre-save hook:", err);
    next(err);
  }
});

const GKServiceRequest  = mongoose.model("GKServiceRequest", GKServiceRequestSchema);

export default GKServiceRequest ;