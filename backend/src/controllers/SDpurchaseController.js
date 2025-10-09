import Purchase from "../models/SDpurchase.js";
import mongoose from "mongoose";
import express from "express";
import { isValidObjectId } from "mongoose";


// GET all purchases
export async function getAllpurchase(req, res) { 
    try {
        // Fixed: createdAt (not createAt)
        const purchases = await Purchase.find().sort({ createdAt: -1 });
        res.status(200).json(purchases);
    } catch (error) {
        console.error("Error in getAllpurchases controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// GET purchase by ID
export async function getpurchasebyId(req, res) { 
    try {
        // Validate ObjectId
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid purchase ID" });
        }

        const purchase = await Purchase.findById(req.params.id);

        if (!purchase) {
            return res.status(404).json({ message: "Purchase not found" }); // Fixed: "purchase" not "note"
        }
        
        res.status(200).json(purchase);
    } catch (error) { 
        console.error("Error in getpurchasebyId controller:", error);
        res.status(500).json({ message: "Internal server error" });  
    }
}

// CREATE new purchase
export async function createpurchase(req, res) {
    try {
        const { apartmentNo, buyer_Name, buyer_id, buyer_Email, buyer_Phone, room_type, price, purchase_date, content, 
                lease_duration, lease_start_date, lease_end_date, security_deposit, monthly_rent } = req.body;

        // Debug: Log all received fields
        console.log('=== BACKEND RECEIVED DATA ===');
        console.log('room_type:', room_type);
        console.log('Rental fields received:', { lease_duration, lease_start_date, security_deposit, monthly_rent });
        console.log('Full req.body:', req.body);

      
        // Basic validation
        if (!apartmentNo || !buyer_Name || !buyer_id || !buyer_Email || !buyer_Phone || !room_type || !price || !purchase_date || !content) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const purchaseData = {
            apartmentNo,
            buyer_Name,
            buyer_id,
            buyer_Email,
            buyer_Phone,
            room_type,
            price: Number(price),
            purchase_date: new Date(purchase_date),
            content
        };

        // Add rental fields if room_type is rent
        if (room_type === 'rent') {
            console.log('Adding rental fields to purchaseData...');
            purchaseData.lease_duration = lease_duration;
            purchaseData.lease_start_date = new Date(lease_start_date);
            purchaseData.lease_end_date = lease_end_date ? new Date(lease_end_date) : null;
            purchaseData.security_deposit = Number(security_deposit) || 0;
            purchaseData.monthly_rent = Number(monthly_rent) || 0;
        }

        console.log('Final purchaseData:', purchaseData);

        const purchase = new Purchase(purchaseData);
        const savedPurchase = await purchase.save();
        
        console.log('Saved purchase with rental fields:', {
            _id: savedPurchase._id,
            room_type: savedPurchase.room_type,
            monthly_rent: savedPurchase.monthly_rent,
            security_deposit: savedPurchase.security_deposit
        });
        
        res.status(201).json(savedPurchase);
    } catch (error) {
        console.error("Error in createpurchase:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// UPDATE purchase
export async function updatedpurchase(req, res) { 
    try {
        // Validate ObjectId
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid purchase ID" });
        }

        // Find the purchase first
        const purchase = await Purchase.findById(req.params.id);
        if (!purchase) {
            return res.status(404).json({ message: "Purchase not found" });
        }

        // ✅ FIXED: Check the specific purchase's room_type, not the model
        if (purchase.room_type !== 'rent') {
            return res.status(403).json({ 
                message: `Only rental agreements can be modified. This is a ${purchase.room_type} purchase.` 
            });
        }

        const { apartmentNo, buyer_Name, buyer_id, buyer_Email, buyer_Phone, room_type, price, purchase_date, content } = req.body;

        // Basic validation
        if (!apartmentNo || !buyer_Name || !buyer_id || !buyer_Email || !buyer_Phone || !room_type || !price || !purchase_date || !content) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Validate email
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(buyer_Email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Validate price
        const priceNum = Number(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            return res.status(400).json({ message: "Price must be a positive number" });
        }

        // Validate date
        const purchaseDate = new Date(purchase_date);
        if (isNaN(purchaseDate.getTime())) {
            return res.status(400).json({ message: "Invalid purchase date" });
        }

        // Update the purchase
        const updatedPurchase = await Purchase.findByIdAndUpdate(
            req.params.id,
            { 
                apartmentNo, buyer_Name, buyer_id, buyer_Email, buyer_Phone, 
                room_type, price: priceNum, purchase_date: purchaseDate, content 
            },
            { new: true }  // Return updated document
        );

        res.status(200).json(updatedPurchase); // Fixed: Direct response, not wrapped
    } catch (error) {
        console.error("Error in updatedpurchase controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// DELETE purchase
export async function deletepurchase(req, res) { 
    try {
        // Validate ObjectId
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid purchase ID" });
        }

        const deletedPurchase = await Purchase.findByIdAndDelete(req.params.id);

        if (!deletedPurchase) {
            return res.status(404).json({ message: "Purchase not found" }); // Fixed: "purchase" not "note"
        }

        res.status(200).json({ message: "Purchase deleted successfully" }); // Fixed: "purchase" not "note"
    } catch (error) {
        console.error("Error in deletepurchase controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}