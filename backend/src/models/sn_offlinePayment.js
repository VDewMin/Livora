import mongoose from "mongoose";
import User from "./vd_user.js";

const offlinePaymentShema = new mongoose.Schema({
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
    amountRent: {
        type: Number,
        required: false
    },
    amountLaundry: {
        type: Number,
        required: false
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    slipFile: {
        data: Buffer,
        contentType: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Rejected"],
        default: "Pending"
    }
});

offlinePaymentShema.pre("save", function(next){
    this.totalAmount = this.amountRent + this.amountLaundry;
    next();
});

const OfflinePayment = mongoose.model("OfflinePayment", offlinePaymentShema);

export default OfflinePayment;