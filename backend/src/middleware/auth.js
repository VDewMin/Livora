import User from "../models/vd_user.js";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"No token provided"});
    }

    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = await User.findById(decoded.id);
            if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if(user.passwordChangedAt){
            const changedTimstamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
            if(decoded.iat < changedTimstamp){
                return res.status(401).json({
                    message: "Password recently changed. Please log in again.",
                });
            }
        }

        req.user = user;
        next();

    } catch (err){
        res.status(403).json({ message: "Invalid or expired token" });
    }
};