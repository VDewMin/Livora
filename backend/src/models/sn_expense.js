import mongoose from "mongoose";

const expenseShema = new mongoose.Schema ({

    expenseId: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Expense = mongoose.model("Expense", expenseShema);

export default Expense;