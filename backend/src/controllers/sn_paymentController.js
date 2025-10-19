import Payment from "../models/sn_payment.js";
import OnlinePayment from "../models/sn_onlinePayment.js";
import OfflinePayment from "../models/sn_offlinePayment.js";
import User from "../models/vd_user.js";
import OTP from "../models/sn_otp.js";
import Purchase from "../models/SDpurchase.js";  
import LaundryRequest from "../models/SDLaundryRequest.js"; 
import nodemailer from "nodemailer";
import Stripe from "stripe";
import dotenv from "dotenv";



dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const generatePaymentId = () => "PAY" + Date.now();
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"LIVORA" <${process.env.EMAIL_USER}`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
  });
};

/*//offline vertify email
const sendOfflineVertifyEmail = async (email,res) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Offline Payment is vertified",
    text: "Payment is vertified by admin.Check your payment history",
  });
};*/


// Online Payment with Stripe + OTP
export const createOnlinePaymentWithOTP = async (req, res) => {
  try {
    const { residentId, apartmentNo , residentName, phoneNumber, amountRent , amountLaundry , email } = req.body;

    if (!residentId || !phoneNumber || !email || !apartmentNo || !residentName) return res.status(400).json({ message: "residentId, phoneNumber and email are required" });

    const paymentId = generatePaymentId();
    const rent = Number(String(amountRent).replace(/[^0-9.-]+/g, "")) || 0;
    const laundry = Number(String(amountLaundry).replace(/[^0-9.-]+/g, "")) || 0;
    const totalAmount = rent + laundry;

    const paymentDate = new Date();

    // Parent Payment
    const parentPayment = await Payment.create({
      paymentId,
      residentId,
      apartmentNo,
      residentName,
      phoneNumber,
      paymentType: "Online",
      totalAmount,
      status: "Pending",
      paymentDate,
    });

    // Stripe Checkout
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "lkr",
            product_data: { name: "Rent + Laundry" },
           unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/verify-otp?paymentId=${paymentId}&email=${email}`,
      cancel_url: "http://localhost:5173/cancel",
    });

    // Child OnlinePayment
    const childOnlinePayment = await OnlinePayment.create({
      paymentId,
      residentId,
      apartmentNo,
      residentName,
      phoneNumber,
      amountRent:rent,
      amountLaundry:laundry,
      totalAmount,
      transactionId: session.id,
      status: "Pending",
      paymentDate,
    });

    // OTP
    const otp = generateOTP();
    const createdAt = Date.now();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.findOneAndUpdate(
      { email },
      { otpCode: otp, createdAt, expiresAt },
      { upsert: true, new: true }
    );
    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: "Payment created. Stripe session ready. OTP sent to email.",
      sessionUrl: session.url,
      parentPayment,
      childOnlinePayment,
    });
  } catch (error) {
    console.error("Error in createOnlinePaymentWithOTP:", error);
    res.status(500).json({
      message: error.message,
      details: error.raw ? error.raw : error
    });
  }
};

//Validate OTP
export const validateOTPAndCompletePayment = async (req, res) => {
  try {
    const { email, otp, paymentId, forceFail } = req.body;

    if (!email || !paymentId) return res.status(400).json({ message: "email, and paymentId are required" });
    if (forceFail) {
      const parentPayment = await Payment.findOneAndUpdate(
        { paymentId },
        { status: "Failed" },
        { new: true }
      );

      const childOnlinePayment = await OnlinePayment.findOneAndUpdate(
        { paymentId },
        { status: "Failed" },
        { new: true }
      );

      return res.status(200).json({
        message: "Payment marked as Failed",
        parentPayment,
        childOnlinePayment,
      });
    }

    if (!email || !otp || !paymentId) return res.status(400).json({ message: "email, otp, and paymentId are required" });

    const record = await OTP.findOne({ email });
    if (!record) return res.status(400).json({ message: "OTP not found" });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });
    if (record.otpCode !== otp) return res.status(400).json({ message: "Invalid OTP" });
    
    const parentPayment = await Payment.findOneAndUpdate(
      { paymentId },
      { status: "Completed" },
      { new: true }
    );

    const childOnlinePayment = await OnlinePayment.findOneAndUpdate(
      { paymentId },
      { status: "Completed" },
      { new: true }
    );

    await OTP.deleteOne({ email });

    const resident = await User.findOne({ residentId: parentPayment.residentId });
    if (resident) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      resident.lastPaidMonth = currentMonth;
      await resident.save();
    }

    res.status(200).json({
      message: "OTP verified successfully. Payment completed.",
      parentPayment,
      childOnlinePayment,
    });
  } catch (error) {
    console.error("Error in validateOTPAndCompletePayment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const record = await OTP.findOne({ email });
    if (!record) return res.status(404).json({ message: "No OTP record found for this email" });

    const newOtp = generateOTP();
    const createdAt = Date.now();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    record.otpCode = newOtp;
    record.createdAt = createdAt;
    record.expiresAt = expiresAt;
    await record.save();

    await sendOTPEmail(email, newOtp);

    res.status(200).json({ message: "New OTP sent successfully" });
  } catch (error) {
    console.error("Error in resendOTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//master + offline
export const createOfflinePayment = async (req , res) => {
    try {
        //master
        const {residentId, amountRent, phoneNumber, amountLaundry, apartmentNo, residentName,} = req.body;
        const slipFile = req.file;

        const paymentId = generatePaymentId();
        const rent = Number(String(amountRent).replace(/[^0-9.-]+/g, "")) || 0;
        const laundry = Number(String(amountLaundry).replace(/[^0-9.-]+/g, "")) || 0;
        const totalAmount = rent + laundry;


        const newPayment = new Payment({
            paymentId,
            residentId,
            apartmentNo,
            residentName,
            phoneNumber,
            paymentType: "Offline",
            totalAmount,
            status: "Pending"
        });
        await newPayment.save();

        //offline
        const newOfflinePayment = new OfflinePayment({
        paymentId,
        residentId,
        apartmentNo,
        residentName,
        phoneNumber,
        amountRent:rent,
        amountLaundry:laundry,
        totalAmount,   
        paymentDate: new Date(),
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

// admin verify
export const vertifyOfflinePayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const offlinePayment = await OfflinePayment.findOne({ paymentId });
    if (!offlinePayment)
      return res.status(404).json({ message: "Offline payment not found" });

    offlinePayment.verified = true;
    offlinePayment.status = "Completed";
    await offlinePayment.save();

    const payment = await Payment.findOne({ paymentId });
    if (payment) {
      payment.status = "Completed";
      await payment.save();
    }

    const resident = await Payment.findOne({ residentId: payment.residentId });
    if (resident) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      resident.lastPaidMonth = currentMonth;
      await resident.save();
    }

    //pending->complete
    res.json({ paymentId, status: "Completed" });
  } catch (error) {
    console.error("Error in verifyOfflinePayment:", error);
    res.status(500).json({ message: error.message });
  }
};

// admin reject
export const rejectOfflinePayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const offlinePayment = await OfflinePayment.findOne({ paymentId });
    if (!offlinePayment)
      return res.status(404).json({ message: "Offline payment not found" });

    offlinePayment.verified = false;
    offlinePayment.status = "Rejected";
    await offlinePayment.save();

    const payment = await Payment.findOne({ paymentId });
    if (payment) {
      payment.status = "Rejected";
      await payment.save();
    }

    //pending->rejected
    res.json({ paymentId, status: "Rejected" });
  } catch (error) {
    console.error("Error in rejectOfflinePayment:", error);
    res.status(500).json({ message: error.message });
  }
};


// Get single payment details
export const getPaymentbyID = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findOne({ paymentId: id });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    let detailedPayment = null;

    if (payment.paymentType === "Offline") {
      const offline = await OfflinePayment.findOne({ paymentId: id });
      if (!offline) return res.status(404).json({ message: "Offline payment not found" });

      const slipFile = offline.slipFile && offline.slipFile.data
        ? {
            data: Buffer.isBuffer(offline.slipFile.data)
              ? offline.slipFile.data.toString("base64")
              : offline.slipFile.data,
            contentType: offline.slipFile.contentType,
          }
        : null;

      detailedPayment = { ...offline.toObject(), slipFile };
    } else if (payment.paymentType === "Online") {
      const online = await OnlinePayment.findOne({ paymentId: id });
      if (!online) return res.status(404).json({ message: "Online payment not found" });

      detailedPayment = online.toObject();
    }

    res.json({ type: payment.paymentType, payment: detailedPayment });
  } catch (error) {
    console.error("Error fetching payment detail:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all payment (WITH month filter)
export const getAllPayment = async (req, res) => {
  try {
    const { month, year } = req.query;

    let query = {};
    if (month && year) {
      const start = new Date(`${year}-${month}-01T00:00:00.000Z`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      query.paymentDate = { $gte: start, $lt: end };
    }

    const payments = await Payment.find(query).sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error in getAllPayments controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get payment by resident
export const getPaymentsByResident = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Resident ID required" });

    const payments = await Payment.find({ residentId: id }).sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error in getPaymentsByResident controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//fetch monthly rent
export const getResidentMonthlyCharges = async (req, res) => {
  try {
    const { id } = req.params;

    const resident = await User.findById(id);
    if (!resident) {
      console.log("No user found in DB for this ID:", id);
      return res.status(404).json({ message: "Resident not found" });
    }

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const payment = await Payment.findOne({
      residentId: id, 
      status: "Completed",
      paymentDate: { $gte: startDate, $lte: endDate },
    });

    let rent = 1000;
    const purchase = await Purchase.findOne({ room_id: resident.apartmentNo });
    if (purchase && (purchase.monthly_rent)) {
      rent = purchase.monthly_rent;
    }

    let laundry = 0;
    const laundryAgg = await LaundryRequest.aggregate([
      {
        $match: {
          resident_id: resident.userId, 
          status: "pending",
          created_at: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: null, total: { $sum: "$total_cost" } } },
    ]);
    if (laundryAgg.length > 0) laundry = laundryAgg[0].total;

    const others = 0;

    return res.json({
      rent,
      laundry,
      others,
      total: rent + laundry + others,
      isPaid: !!payment,
    });
  } catch (err) {
    console.error("Error fetching resident charges:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//status
  export const getAllResidentsMonthlyCharges = async (req, res) => {
    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      //etch all residents
      const residents = await User.find({ role: "Resident" }).lean();

      //Fetch all purchases rent
      const purchases = await Purchase.find({
        room_id: { $in: residents.map(r => r.apartmentNo) },
      }).lean();

      // Map apartmentNo -> monthly_rent
      const purchaseMap = {};
      purchases.forEach(p => {
        purchaseMap[p.room_id] = p.monthly_rent || 1000;
      });

      // Fetch all laundry current month
      const laundryRequests = await LaundryRequest.find({
        resident_id: { $in: residents.map(r => r.userId) },
        //status: "completed",
        created_at: { $gte: startDate, $lt: endDate },
      }).lean();

      // Map residentId -> totalLaundry
      const laundryMap = {};
      laundryRequests.forEach(l => {
        laundryMap[l.resident_id] = (laundryMap[l.resident_id] || 0) + l.total_cost;
      });

      // Fetch all payments for current month
      const payments = await Payment.find({
        $or: [
          { residentId: { $in: residents.map(r => r.userId) } },
        ],
        status: "Completed",
        paymentDate: { $gte: startDate, $lt: endDate },
      }).lean();
      

      // Map residentId -> totalPaid
      const paymentMap = {};
      payments.forEach(p => {
        
        const residentKey = p.residentId || residents.find(r => r.apartmentNo === p.apartmentNo)?.userId;
        if (residentKey) {
          paymentMap[residentKey] = (paymentMap[residentKey] || 0) + p.totalAmount;
        }
      });
      

      // compare
      const result = residents.map(r => {
        const rent = purchaseMap[r.apartmentNo] || 0;
        const laundry = laundryMap[r.userId] || 0;
        const totalDue = rent + laundry;
        const totalPaid = paymentMap[r.userId] || 0;
        
        let status;
          if (totalDue === 0 && totalPaid === 0) {
          status = "Unpaid"; 
        } else if (totalPaid >= totalDue && totalDue > 0) {
          status = "Paid";
        } else {
          status = "Unpaid";
        }

        console.log("🧾 Total residents:", residents.length);
        console.log("🧺 Laundry Requests:", laundryRequests.length);
        console.log("💰 Purchases:", purchases.length);
        console.log("💳 Payments:", payments.length);

        // Optional deeper checks
        console.log("Laundry Map:", laundryMap);
        console.log("Purchase Map:", purchaseMap);
        console.log("Payment Map:", paymentMap);


        return {
          residentId: r.userId,
          residentName: `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim(),
          apartmentNo: r.apartmentNo || "",
          monthlyPayment: totalDue,
          paidAmount: totalPaid,
          status,
        };
      });

      res.json(result);
    } catch (err) {
      console.error("Error fetching resident charges:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
