//import Payment from "../models/sn_payment.js";

/*export const getAllPayment = async(req,res) => {
    try {
        const payments = await Payment.find().sort({createdAt: -1});
        res.status(200).json(payments)
    } catch (error) {
        console.error("Error in getAllPayments controller", error);
        res.status(500).json({message: "Internel Server Error"});
    }
}

export const getPaymentbyID = async(req,res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({message:"payment not found"});
        res.json(payment)
    } catch (error) {
        console.error("Error in getPaymentbyID controller", error);
        res.status(500).json({message: "Internel Server Error"});
    }
}

export const createPayment = async(req,res) => {
    try {
        const {RoomID,ResidentName,MonthlyRent,MonthlyEbill,MonthlyWbill,MonthlyOther,MonthlyPayment,Status} = req.body
        console.log(RoomID,ResidentName,MonthlyRent,MonthlyEbill,MonthlyWbill,MonthlyOther,MonthlyPayment,Status)
        const newPayment = new Payment({RoomID,ResidentName,MonthlyRent,MonthlyEbill,MonthlyWbill,MonthlyOther,MonthlyPayment,Status})

        const savedPayment = await newPayment.save();
        res.status(201).json(savedPayment)

    } catch (error) {
        console.error("Error in createPayment controller", error);
        res.status(500).json({message: "Internel Server Error"});
    }
}

export const updatePayment = async(req,res) => {
    
    try {
      const {RoomID,ResidentName,MonthlyRent,MonthlyEbill,MonthlyWbill,MonthlyOther,MonthlyPayment,Status} = req.body
      const updatedPayment = await Payment.findByIdAndUpdate(req.params.id,{RoomID,ResidentName,MonthlyRent,MonthlyEbill,MonthlyWbill,MonthlyOther,
        MonthlyPayment,Status},
        {
            new: true,
        });
      
      if (!updatedPayment) return res.status(404).json({message:"Payment not found"});

      res.status(200).json({updatedPayment});
    } catch (error) {
        console.error("Error in updatePayment controller", error);
        res.status(500).json({message: "Internel Server Error"});
    }
}

export const deletePayment = async(req,res) => {
    try {

      const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
      
      if (!deletedPayment) return res.status(404).json({message:"Payment not found"});

      res.status(200).json({message: "Payment deleted Succesfully"});
    } catch (error) {
        console.error("Error in deletePayment controller", error);
        res.status(500).json({message: "Internel Server Error"});
    }
}*/

import OfflinePayment from "../models/sn_offlinePayment.js";
import OnlinePayment from "../models/sn_onlinePayment.js";
import Payment from "../models/sn_payment.js";

const generatePaymentId = () => {
    return "PAY" + Date.now();
};

//Payment + online
export const createOnlinePayment = async (req, res) => {
    try {
        const {residentId, phoneNumber, amountRent, amountLaundry, transactionId } = req.body;

        //generate master paymentId
        const paymentId = generatePaymentId();

        //create Payment
        const newPayment = new Payment({
            paymentId,
            residentId,
            phoneNumber,
            paymentType: "Online",
            totalAmount: amountRent + amountLaundry,
            status: "Completed"
        });
        await newPayment.save();
    
    //create child online
        const newOnlinePayment = new OnlinePayment({
        paymentId,
        residentId,
        phoneNumber,
        amountRent,
        amountLaundry,
        transactionId,
        status: "Completed"
    });
    await newOnlinePayment.save();
    res.status(201).json({master: newPayment , online: newOnlinePayment});

    } catch (error) {
        console.error("Error in createOnlinePayment controller", error);
        res.status(500).json({message:"Internel Server Error"})
    }

};


//master + offline
export const createOfflinePayment = async (req , res) => {
    try {
        //master
        const {residentId, amountRent, amountLaundry } = req.body;
        const slipFile = req.file;

        const paymentId = generatePaymentId();

        const newPayment = new Payment({
            paymentId,
            residentId,
            phoneNumber,
            paymentType: "Offline",
            totalAmount: amountRent + amountLaundry,
            status: "Pending"
        });
        await newPayment.save();

        //offline
        const newOfflinePayment = new OfflinePayment({
        paymentId,
        residentId,
        phoneNumber,
        amountRent,
        amountLaundry,
        slipFile: slipFile ? {data: slipFile.buffer , contentType: slipFile.mimetype} : null,
        status: "Pending"
    });
    await newOfflinePayment.save();
    res.status(201).json({ master: newPayment, offline: newOfflinePayment});
    } catch (error) {
        console.error("Error in createOfflinePayment controller", error);
        res.status(500).json({message:"Internel Server Error"});
    }
    
};

//admin vertify
export const vertifyOfflinePayment = async (req , res) => {
    try {
        const {paymentId} = req.body;

        const offlinePayment = await OfflinePayment.findOne({paymentId});
        if (!offlinePayment) return res.status(404).json({message:"Offline payment not found"});

        offlinePayment.verified = true;
        offlinePayment.status = "Completed";
        await offlinePayment.save();

        const payment = await Payment.findOne({paymentId});
        payment.status = "Completed";
        await payment.save();

        res.json({payment, offlinePayment});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get all payment
export const getAllPayment = async(req,res) => {
    try {
        const payments = await Payment.find().sort({createdAt: -1});
        res.status(200).json(payments)
    } catch (error) {
        console.error("Error in getAllPayments controller", error);
        res.status(500).json({message: "Internel Server Error"});
    }
};

//get one 
export const getPaymentbyID = async(req,res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({message:"payment not found"});
        res.json(payment)
    } catch (error) {
        console.error("Error in getPaymentbyID controller", error);
        res.status(500).json({message: "Internel Server Error"});
    }
}
//download recipt

