import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Resident", "Staff"], default: "Resident" },

  apartmentNo: { 
    type: String, 
    required: function() { return this.role === "Resident"; } 
  },
  residentType: { 
    type: String, 
    enum: ["Owner", "Tenant"], 
    default: "Tenant",
    required: function() { return this.role === "Resident"; } 
  },
  
  staffType: { 
    type: String, 
    enum: ["Security", "Maintenance", "Manager", "Cleaner"], 
    required: function() { return this.role === "Staff"; } 
  },

}, { timestamps: true });


const User = mongoose.model("User", userSchema);
export default User;
