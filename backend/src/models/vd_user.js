import mongoose from "mongoose";
import Counter from "./counter.js";

const userSchema = new mongoose.Schema({

  userId: { type: String, unique: true, required: false },

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true, unique: true },
  secondaryPhoneNo: { type: String },   
  recoveryEmail: { type: String },    
  dateOfBirth: { type: Date },          
  emergencyContactName: { type: String },     
  emergencyContactNumber: { type: String },   
  familyMembers: { type: Number },       
  medicalConditions: { type: String },      
  job: { type: String },                  

  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Resident", "Staff"], default: "Resident" },
  twoFactorEnabled: { type: Boolean, default: false },

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
    enum: ["Security", "Maintenance", "Manager", "Laundry"], 
    required: function() { return this.role === "Staff"; } 
  },

  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  
  passwordChangedAt: { type: Date },

  profilePicture: {
    data: Buffer,
    contentType: String
  },

}, { timestamps: true });

// Auto-generate userId with prefix based on role
userSchema.pre("save", async function (next) {
  try {
    if (!this.userId) {
      let prefix;
      if (this.role === "Resident") prefix = "R";
      else if (this.role === "Staff") prefix = "ST";
      else if (this.role === "Admin") prefix = "A";
      else prefix = "U"; // fallback

      let counter = await Counter.findOne({ name: prefix });
      if (!counter) {
        counter = await Counter.create({ name: prefix, seq: 0 });
      }

      counter.seq += 1;
      await counter.save();

      this.userId = prefix + counter.seq.toString().padStart(3, "0");
    }
    next();
  } catch (err) {
    console.error("Error generating userId:", err);
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
