import express from "express";
import multer from "multer";

import {getAllPayment, createOnlinePaymentWithOTP , resendOTP , createOfflinePayment , vertifyOfflinePayment , getPaymentbyID , validateOTPAndCompletePayment , rejectOfflinePayment } from "../controllers/sn_paymentController.js"

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getAllPayment);

router.post("/validate-otp", validateOTPAndCompletePayment);

router.post("/checkout", createOnlinePaymentWithOTP);

router.post("/resend-otp", resendOTP);

router.get("/:id", getPaymentbyID);

router.post("/offline", upload.single("slipFile"), createOfflinePayment);

router.post("/verify-offline", vertifyOfflinePayment);

router.post("/reject-offline", rejectOfflinePayment);

export default router;