import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
import express from "express";
import OnlinePayment from "../models/sn_onlinePayment.js";
import Payment from "../models/sn_payment.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// helper
const generatePaymentId = () => "PAY" + Date.now();

router.post("/", async (req, res) => {
  try {
    const { residentId, amountRent, amountLaundry, phoneNumber } = req.body;

    if (!residentId) return res.status(400).json({ error: "residentId is required" });
    if (!phoneNumber) return res.status(400).json({ error: "phoneNumber is required" });

    const rent = Number(amountRent) || 0;
    const laundry = Number(amountLaundry) || 0;
    const totalLKR = rent + laundry;

    // temporary conversion LKR -> USD
    const rate = 0.0033;
    const totalUSD = totalLKR * rate;

    if (isNaN(totalUSD) || totalUSD <= 0) {
      return res.status(400).json({ error: "Invalid amount values" });
    }

    // generate our custom paymentId
    const paymentId = generatePaymentId();

    // Master Payment
    const master = await Payment.create({
      paymentId,
      residentId,
      phoneNumber,
      paymentType: "Online",
      totalAmount: totalLKR,
      status: "Pending",
    });

    // Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Rent + Laundry" },
            unit_amount: Math.round(totalUSD * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    // Online Payment child (linked by custom paymentId)
    const online = await OnlinePayment.create({
      paymentId, // ✅ use same string id
      residentId,
      phoneNumber,
      amountRent: rent,
      amountLaundry: laundry,
      totalAmount: totalLKR,
      transactionId: session.id,
      status: "Pending",
      paymentDate: new Date(),
    });

    res.json({
      url: session.url,
      totalLKR,
      totalUSD: totalUSD.toFixed(2),
      rate,
      master,
      online,
    });

  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "Payment creation failed" });
  }
});

export default router;
