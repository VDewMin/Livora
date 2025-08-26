import Payment from "../models/sn_payment.js";

export const getAllPayment = async(req,res) => {
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
}


