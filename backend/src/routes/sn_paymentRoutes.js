import express from "express";
import {getAllPayment, createOnlinePaymentWithOTP , resendOTP , createOfflinePayment , vertifyOfflinePayment , getPaymentbyID , validateOTPAndCompletePayment } from "../controllers/sn_paymentController.js"

const router = express.Router();

router.get("/", getAllPayment);

router.post("/validate-otp", validateOTPAndCompletePayment);

router.post("/checkout", createOnlinePaymentWithOTP);

router.post("/resend-otp", resendOTP);

router.get("/:id", getPaymentbyID);



router.delete("/:id", vertifyOfflinePayment);



export default router;