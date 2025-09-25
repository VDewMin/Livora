import Payment from "../models/sn_payment.js";
import OnlinePayment from "../models/sn_onlinePayment.js";
import OfflinePayment from "../models/sn_offlinePayment.js";
import OTP from "../models/sn_otp.js";
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
//OTP email
const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
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

// ---------------- Online Payment with Stripe + OTP ----------------
export const createOnlinePaymentWithOTP = async (req, res) => {
  try {
    const { residentId, apartmentNo , residentName, phoneNumber, amountRent , amountLaundry , email } = req.body;

    if (!residentId || !phoneNumber || !email || !apartmentNo || !residentName) return res.status(400).json({ message: "residentId, phoneNumber and email are required" });

    const paymentId = generatePaymentId();
    const totalAmount = Number(amountRent) + Number(amountLaundry);
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
      amountRent,
      amountLaundry,
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
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ---------------- Validate OTP and Complete ----------------
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

// ---------------- Resend OTP ----------------
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const record = await OTP.findOne({ email });
    if (!record) return res.status(404).json({ message: "No OTP record found for this email" });

    // Generate new OTP
    const newOtp = generateOTP();
    const createdAt = Date.now();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    record.otpCode = newOtp;
    record.createdAt = createdAt;
    record.expiresAt = expiresAt;
    await record.save();

    // Send new OTP email
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
        const total = Number(amountRent) + Number(amountLaundry);


        const newPayment = new Payment({
            paymentId,
            residentId,
            apartmentNo,
            residentName,
            phoneNumber,
            paymentType: "Offline",
            totalAmount: total,
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
        amountRent,
        amountLaundry,
        totalAmount: total,   
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

// ---------------- Offline Payment Handlers ----------------

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

    // Return updated list for frontend to remove it from pending
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

    // Return updated list for frontend to remove it from pending
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
      // Build date range for that month
      const start = new Date(`${year}-${month}-01T00:00:00.000Z`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1); // next month start

      query.paymentDate = { $gte: start, $lt: end };
    }

    const payments = await Payment.find(query).sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error in getAllPayments controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


/*//get all payment
export const getAllPayment = async(req,res) => {
    try {
        const payments = await Payment.find().sort({createdAt: -1});
        res.status(200).json(payments)
    } catch (error) {
        console.error("Error in getAllPayments controller", error);
        res.status(500).json({message: "Internel Server Error"});
    }
};*/


