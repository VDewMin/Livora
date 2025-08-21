import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: {type: String, required: true, unique: true},
  apartmentNo: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Resident", "Staff"], default: "Resident" },
}, { timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;
