import mongoose from "mongoose";
import Counter from "./counter.js";

const expenseShema = new mongoose.Schema ({

    expenseId: {
        type: String,
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

//generate auto service id 
expenseShema.pre("save", async function (next) {
  try {
    // Only generate expenseId if it is not already set
    if (!this.expenseId) {
      let counter = await Counter.findOne({ name: "expense" });
      
      // Initialize counter if missing
      if (!counter) {
        counter = await Counter.create({ name: "expense", seq: 0 });
      }

      // Increment counter
      counter.seq += 1;
      await counter.save();

      // Set expenseId
      this.expenseId = "E" + counter.seq.toString().padStart(3, "0");
    }

    next();
  } catch (err) {
    console.error("Error in pre-save hook:", err);
    next(err);
  }
});


const Expense = mongoose.model("Expense", expenseShema);

export default Expense;