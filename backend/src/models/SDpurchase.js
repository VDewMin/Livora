import mongoose from "mongoose";


// Purchase Schema
const purchaseSchema = new mongoose.Schema({
   
    apartmentNo: { 
        type: String, 
        required: true,
        match: [/^[PR](?:[1-8]0[1-6]|0[1-6])$/, "enter a valid apartment number (e.g., P101, R806)"]
     },
    buyer_Name: { type: String, required: true },
    userId: { type: String, required: true },
    buyer_Email: { 
        type: String, 
        required: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    buyer_Phone: { 
        type: String, 
        required: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    },
    room_type: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    purchase_date: { type: Date, required: true },
    content: { type: String, required: true },
    
    // Rental-specific fields
    lease_duration: { 
        type: String, 
        enum: ['6_months', '12_months', '24_months', 'custom'], 
        default: null 
    },
    lease_start_date: { type: Date, default: null },
    lease_end_date: { type: Date, default: null },
    security_deposit: { type: Number, default: 0, min: 0 },
    monthly_rent: { type: Number, default: 0, min: 0 }
}, { 
    timestamps: true 
});


const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;