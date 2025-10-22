import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        
    },
    otpCode: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 300}
    },
});

const OTP = mongoose.model("OTP",otpSchema);

export default OTP;