import User from "../models/vd_user.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createTransporter } from "../utils/vd_email.js";

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const OTP_EXPIRY = 5 * 60 * 1000;
const RESET_TOKEN_EXPIRY_MS = 15 * 60 * 1000;

let otpStore = {};

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query; // get ?role=Resident from URL
    let users;

    if (role) {
      users = await User.find({ role });
    } else {
      users = await User.find();
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getUserById = async(req, res) => {

    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({message: "Note not found"});
        res.json(user);
        
    } catch (error) {

        console.error("Error in getUserById", error);
        res.status(500).json({message: "Internal server error"});
    }
    
}

export const createUser = async(req, res) => {

    try{
        const {firstName, lastName, email, phoneNo, password, role, apartmentNo, residentType, staffType} = req.body

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            firstName, 
            lastName, 
            email, 
            phoneNo, 
            password: hashedPassword, 
            role, 
            ...(role === "Resident" && { apartmentNo, residentType }),
            ...(role === "Staff" && { staffType }),
        });

        const savedUser = await newUser.save();
        res.status(201).json({savedUser});
    } catch (error) {

        console.error("Error in createUser controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const updateUser = async(req, res) => {

    try {
        const {firstName, lastName, email, phoneNo, password, role, apartmentNo, residentType, staffType,} = req.body;

        const updateData = {
            firstName,
            lastName,
            email,
            phoneNo,
            password,
            role,
            ...(role === "Resident" && { apartmentNo, residentType }),
            ...(role === "Staff" && { staffType, department }),
        };

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            {new:true}
        );

        if(!updatedUser) return res.status(404).json({message:"Note not found"});
        res.status(200).json({updatedUser});
        
    } catch (error) {
        
        console.error("Error in updateUser controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const deleteUser = async(req, res) => {

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(!deletedUser) return res.status(404).json({message: 'Not not found'});
        res.status(200).json({deletedUser});

    } catch (error) {
        console.error("Error in deleteUser controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const loginUser = async (req, res) => {
    try{
        const { email, password} = req.body;

        //check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }

        //password check
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"});
        }

        //Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[user._id] = { otp, expiresAt: Date.now() + OTP_EXPIRY};

        //send otp via email
        const transporter = createTransporter();

        await transporter.sendMail({
            from: `"Smart System" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Your OTP code",
            text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
        });
        
        res.json({ message: "OTP sent to email", userId: user._id });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({message: "Server error"});
    }
};

export const verifyOtp = async(req, res) => {
        try{
            const { userId, otp } = req.body;

            const record = otpStore[userId];
            if(!record) return res.status(400).json({message: "No OTP found"});

            if (Date.now() > record.expiresAt) {
                delete otpStore[userId];
                return res.status(400).json({message: "OTP expired" });
            }

            if (record.otp != otp) {
                return res.status(400).json({ message: "Invalid OTP" });
            }

            //OTP valid then issue JWT

            delete otpStore[userId];
            const user = await User.findById(userId);

            //Generate jwt token
            const token = jwt.sign(
                { id: user._id, role: user.role},
                JWT_SECRET,
                {expiresIn: "1d"}
            );


            // return user and token
            res.json({
                message: "Login successful",
                token,
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    staffType: user.staffType || null,        //  include staffType
                    apartmentNo: user.apartmentNo || null,    //  include if Resident
                    residentType: user.residentType || null,  //  include if Resident
                },
            });


        }catch(err){
            console.error("OTP verify error:", err);
            res.status(500).json({ message: "Server error" });
        }
}; 

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if(!email) return res.status(400).json({message: "Email required"});

        const user = await User.findOne({ email });
        if (!user) {
        // For security, you may still return 200 so attackers can't enumerate emails.
        return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + RESET_TOKEN_EXPIRY_MS;

        await user.save();

        const transporter = createTransporter();

        const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${rawToken}`;

        await transporter.sendMail({
            from:`"Smart System" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password reset for your account",
            text: `You requested a password reset. Click this link (or paste in browser): ${resetLink}\n\nThis link is valid for 15 minutes.`,
            html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> (or paste in browser):</p><p>${resetLink}</p><p>This link is valid for 15 minutes.</p>`
        });

        return res.status(200).json({ message: "If that email exists, a reset link has been sent." });


    } catch (err) {
        console.error("forgotPassword error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    try{
        const {token, password} = req.body;
        if(!token || !password) return res.status(400).json({message: "Token and new password are required"});

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if(!user) return res.status(400).json({ message: "Invalid or expired token"});

        const saltRounds = 10;
        user.password = await bcrypt.hash(password, saltRounds);

        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        try {
            const transporter = createTransporter();
            await transporter.sendMail({
                from: `"Smart System" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: "Your password has been changed",
                text: `Your password was successfully changed. If you did not do this, contact support immediately.`,    
            });
        } catch (e) {
            console.warn("Failed sending confirmation email:", e);
        }

        return res.status(200).json({ message: "Password reset successful" });

    } catch (err) {
        console.error("resetPassword error:", err);
        return res.status(500).json({ message: "Server error"});
    }
};