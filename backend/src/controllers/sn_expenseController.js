import Expense from "../models/sn_expense.js";
import Payment from "../models/sn_payment.js";

export const getAllExpenses = async(req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error in getAllExpense Controller", error);
        res.status(500).json({message : "Internal server error"});
    }
}

export const getExpenseById = async(req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if(!expense) return res.status(404).json({message: "Expense not found"});
        res.json(expense)
    } catch (error) {
        console.error("Error in getExpenseById Controller", error);
        res.status(500).json({message : "Internal server error"});
    }
}

export const createExpense = async(req, res) => {
    try {
        const {expenseId, description, amount, date} = req.body
        const newExpense = new Expense({expenseId, description, amount, date})

        const savedExpense = await newExpense.save();
        res.status(201).json({savedExpense})
    } catch (error) {
        console.error("Error in createExpenses Controller", error) 
        res.status(500).json({message : "Internal server error"}) 
    }
}

export const updateExpense = async(req, res) => {
    try {
        const {expenseId, description, amount, date} = req.body
        const updateExpense = await Expense.findByIdAndUpdate(req.params.id, {description, amount, date}, {new: true})

        if (!updateExpense) return res.status(404).json({message: "Expense not Found"})
            res.status(200).json({updateExpense});
    } catch (error) {
        console.error("Error in updateExpense Controller", error) 
        res.status(500).json({message : "Internal server error"})
    }
}

export const deleteExpense = async(req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id)
        if(!deletedExpense) return res.status(404).json({message: "Expense not Found"})
            res.status(200).json({message : "Expense deleted successfully!"});
    } catch (error) {
        console.error("Error in deleteExpense Controller", error) 
        res.status(500).json({message : "Internal server error"})
    }
}

export const calculateIncome = async(req, res) => {
    try {
        const paymentResult = await Payment.aggregate([
            {$group: {_id: null, total: {$sum: "$totalAmount"}}}
        ]);

        const expenseResult = await Expense.aggregate([
            {$group: {_id: null, total: {$sum: "$amount"}}}
        ]);

        const totalPayments = paymentResult[0]?.total || 0;
        const totalExpenses = expenseResult[0]?.total || 0;

        const income = totalPayments - totalExpenses;

        res.status(200).json({income});
    } catch (error) {
        console.error("Error in calculateIncome Controller", error) 
        res.status(500).json({message : "Internal server error"})
    }
}
