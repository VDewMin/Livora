import express from "express";
import {getAllPayment, createPayment , deletePayment , updatePayment , getPaymentbyID} from "../controllers/sn_paymentController.js"

const router = express.Router();

router.get("/", getAllPayment);

router.get("/:id", getPaymentbyID);

router.post("/", createPayment)

router.put("/:id", updatePayment)

router.delete("/:id", deletePayment)

export default router;