import express from "express";
import multer from "multer";

import {getAllExpenses , getExpenseById , createExpense, updateExpense, deleteExpense, calculateIncome} from "../controllers/sn_expenseController.js"

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.get("/", getAllExpenses);

router.post("/", upload.single("attachment"), createExpense);

router.get("/calculateIncome", calculateIncome)

router.get("/:id", getExpenseById);

router.put("/:id", updateExpense);

router.delete("/:id", deleteExpense);

export default router;