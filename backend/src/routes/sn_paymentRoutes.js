import express from "express";
import multer from "multer";

import {getAllPayment, createOnlinePaymentWithOTP , resendOTP , createOfflinePayment ,
     vertifyOfflinePayment , getPaymentbyID , validateOTPAndCompletePayment , rejectOfflinePayment,
      getPaymentsByResident, getResidentMonthlyCharges, getAllResidentsCurrentMonthCharges } from "../controllers/sn_paymentController.js"

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getAllPayment);

router.get("/resident/:id", getPaymentsByResident);

router.post("/validate-otp", validateOTPAndCompletePayment);

router.post("/checkout", createOnlinePaymentWithOTP);

router.post("/resend-otp", resendOTP);

router.get("/payment/:id", getPaymentbyID);

router.post("/offline", upload.single("slipFile"), createOfflinePayment);

router.post("/verify-offline", vertifyOfflinePayment);

router.post("/reject-offline", rejectOfflinePayment);

router.get("/charges/:id", getResidentMonthlyCharges);

router.get("/residents/current-month-charges", getAllResidentsCurrentMonthCharges);

export default router;