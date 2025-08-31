import express from "express";
import {getAllPayment, createOnlinePayment , createOfflinePayment , vertifyOfflinePayment , getPaymentbyID} from "../controllers/sn_paymentController.js"

const router = express.Router();

router.get("/", getAllPayment);

router.get("/:id", getPaymentbyID);

router.post("/", createOnlinePayment)

router.put("/", createOfflinePayment)

router.delete("/:id", vertifyOfflinePayment)

export default router;