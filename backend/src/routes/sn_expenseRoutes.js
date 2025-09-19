import express from "express";

import {getAllExpenses , getExpenseById , createExpense, updateExpense, deleteExpense, calculateIncome} from "../controllers/sn_expenseController.js"

const router = express.Router();

router.get("/", getAllExpenses);

router.get("/:id", getExpenseById);

router.post("/", createExpense);

router.put("/:id", updateExpense);

router.delete("/:id", deleteExpense);

router.put("/income", calculateIncome)

export default router;