import mongoose from "mongoose";

const paymentShema = new mongoose.Schema( {
    RoomID: {
        type:String,
        required:true
    },
    ResidentName: {
        type:String,
        required:true
    },
    MonthlyRent: {
        type:Number,
        required:true
    },
    MonthlyEbill: {
        type:Number,
        required:true
    },
    MonthlyWbill: {
        type:Number,
        required:true
    },
    MonthlyOther: {
        type:Number,
        required:true
    },
    MonthlyPayment: {
        type:Number,
        required:true
    },
    Status: {
        type:Boolean,
        required:true
    },
},
{timestamps:true}
);

const Payment = mongoose.model("Payment", paymentShema)

export default Payment