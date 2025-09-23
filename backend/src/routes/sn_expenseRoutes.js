import express from "express";

import {getAllExpenses , getExpenseById , createExpense, updateExpense, deleteExpense, calculateIncome} from "../controllers/sn_expenseController.js"

const router = express.Router();

router.get("/", getAllExpenses);

router.post("/", createExpense);

router.get("/calculateIncome", calculateIncome)

router.get("/:id", getExpenseById);

router.put("/:id", updateExpense);

router.delete("/:id", deleteExpense);



export default router;