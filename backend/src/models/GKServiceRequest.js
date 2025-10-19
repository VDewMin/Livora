import mongoose from "mongoose";
import Counter from "./counter.js";

const GKServiceRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  aptNo: { type: String, required: true },
  serviceId: { type: String, unique: true },
  contactNo: { type: String, required: true },
  contactEmail: { type: String, required: true },
  serviceType: { type: String, required: true },
  description: { type: String },
  fileUrl: { data: Buffer, contentType: String },
  assignedAt: { type: Date },
  assignedTechnician: { type: String, default: "" },
  assignedDate: { type: Date },
  status: {
      type: String,
      enum: ["Pending", "Processing",],
      default: "Pending",
    },
},
    { timestamps: true } //createdAt, updateAt
);

GKServiceRequestSchema.pre("save", async function (next) {
  try {
    
    if (!this.serviceId) {
      let counter = await Counter.findOne({ name: "service" });
      
      if (!counter) {
        counter = await Counter.create({ name: "service", seq: 0 });
      }

      counter.seq += 1;
      await counter.save();

    
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