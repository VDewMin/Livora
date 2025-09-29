import mongoose from "mongoose";

const expenseShema = new mongoose.Schema ({

    expenseId: {
        type: String,
        required: true,
        unique: true
    },

    category: {
        type: String,
        enum: [
            "Utilities",        // Water, electricity, gas
            "Staff Salaries",   // Maintenance crew, security, cleaners
            "Repairs & Maintenance", // Plumbing, electrical, painting, etc.
            "Supplies",         // Cleaning materials, office supplies
            "Security",         // Security system, guards
            "Waste Management", // Garbage collection, recycling
            "Pest Control",     // Termite treatment, mosquito control
            "Landscaping",      // Gardening, lawn maintenance
            "Insurance",        // Property or liability insurance
            "Legal & Compliance", // Government fees, permits, legal expenses
            "Marketing",        // Ads, community events
            "Miscellaneous"     // Anything else not listed
        ],
        required: true,
    },


    amount: {
        type: Number,
        required:true
    },

    paymentMethod: {
        type: String,
        enum: ["Cash", "Bank Transfer", "Online Payment", "Card", "Other"],
        required: true,
    },

    date: {
        type: Date,
        default: Date.now
    },

    notes: {
        type: String,
        required: true,
    },

    attachment: {
        data: Buffer,
        contentType: String
    }
});

const Expense = mongoose.model("Expense", expenseShema);

export default Expense;