import mongoose from "mongoose";


// Purchase Schema
const purchaseSchema = new mongoose.Schema({
   
    room_id: { type: String, required: true },
    buyer_Name: { type: String, required: true },
    buyer_id: { type: String, required: true },
    buyer_Email: { 
        type: String, 
        required: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    buyer_Phone: { type: String, required: true },
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