import Expense from "../models/sn_expense.js";
import Payment from "../models/sn_payment.js";

export const getAllExpenses = async(req, res) => {
    try {
        const { month, year } = req.query;

        let filter = {};
        if (month && year) {
            const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);
            filter.date = { $gte: startDate, $lt: endDate };
        }

        const expenses = await Expense.find(filter).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error in getAllExpense Controller", error);
        res.status(500).json({message : "Internal server error"});
    }
};


/*export const getAllExpenses = async(req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error in getAllExpense Controller", error);
        res.status(500).json({message : "Internal server error"});
    }
}*/

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


export const calculateIncome = async (req, res) => {
  try {
    const { month, year } = req.query; // e.g. /calculateIncome?month=09&year=2025

    let startDate, endDate;
    if (month && year) {
      // Build start & end date range for selected month
      startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Build filter if month/year provided
    const paymentFilter = startDate ? { paymentDate: { $gte: startDate, $lt: endDate } } : {};
    const expenseFilter = startDate ? { date: { $gte: startDate, $lt: endDate } } : {};

    const payments = await Payment.find(paymentFilter);
    const expenses = await Expense.find(expenseFilter);

    const totalIncome = payments.reduce((sum, p) => sum + Number(p.totalAmount || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    res.status(200).json({
      totalIncome,
      totalExpenses,
      month: month || null,
      year: year || null
    });
  } catch (error) {
    console.error("Error in calculateIncome Controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}



