import mongoose from "mongoose";
import User from "./vd_user.js"

const onlinePaymentShema = new mongoose.Schema({
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
    transactionId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending"
    }
});

onlinePaymentShema.pre("save",function(next){
    this.totalAmount = this.amountRent + this.amountLaundry;
    next();
});

const OnlinePayment = mongoose.model("OnlinePayment", onlinePaymentShema);

export default OnlinePayment;