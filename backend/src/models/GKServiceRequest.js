import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  contactNo: { type: String, required: true },
  serviceType: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
},
    {timestamps: ture } //createdAt, updateAt
);

const service = mongoose.model("service", serviceSchema)

export default service;