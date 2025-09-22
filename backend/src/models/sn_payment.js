import mongoose from "mongoose";
import User from "./vd_user.js";

const paymentShema = new mongoose.Schema({
    paymentId: { 
        type: String,
        required: true,
        unique: true 
     },
    residentId: {
        type: String,
        ref: User,
        required: true 
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    paymentType: {
        type: String,
        enum: ["Online", "Offline"],
        required: true 
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Rejected", "Failed"],
        default: "Pending" 
    },
    paymentDate: {
        type: Date,
        default: Date.now }
},
{timestamps:true}
);

const Payment = mongoose.model("Payment", paymentShema)

export default Payment