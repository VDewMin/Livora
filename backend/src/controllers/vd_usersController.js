import User from "../models/vd_user.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createTransporter } from "../utils/vd_email.js";
import GKServiceRequest from "../models/GKServiceRequest.js";
import Parcel from "../models/ks_Parcel.js";
import Payment from "../models/sn_payment.js";
import Feedback from "../models/vd_feedback.js";
import ConventionHallBooking from "../models/SDConventionHallBooking.js";
import Notification from "../models/vd_notification.js";
import { emitNotification } from "../utils/vd_emitNotification.js";


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


export const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      recoveryEmail,
      phoneNo,
      secondaryPhoneNo,
      password,
      role,
      apartmentNo,
      residentType,
      staffType,
      dateOfBirth,
      job,
      emergencyContactName,
      emergencyContactNumber,
      familyMembers,
      medicalConditions,
    } = req.body;

    if (role === "Resident" && apartmentNo) {
      const existingResident = await User.findOne({ apartmentNo });
      if (existingResident) {
        return res.status(400).json({ message: "Apartment number already registered." });
      }
    }

    const plainPassword = password;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstName,
      lastName,
      email,
      recoveryEmail,
      phoneNo,
      secondaryPhoneNo,
      password: hashedPassword,
      role,
      dateOfBirth,
      job,
      emergencyContactName,
      emergencyContactNumber,
      familyMembers,
      medicalConditions,
      ...(role === "Resident" && { apartmentNo, residentType }),
      ...(role === "Staff" && { staffType }),
    });

    if (dateOfBirth) {
      User.dateOfBirth = new Date(dateOfBirth + "T00:00:00Z");
    }

    const savedUser = await newUser.save();

    // send welcome email with credentials
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"LIVORA" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to Livora - Your Account Details",
        text: `Hello ${firstName},

            Your account has been created successfully.

            Username: ${email}
            Password: ${plainPassword}

            You can now log in to your account.

            - Livora Team`,
                    html: `
                      <h2>Welcome to Livora!</h2>
                      <p>Hello <strong>${firstName}</strong>,</p>
                      <p>Your account has been created successfully.</p>
                      <p><strong>Username:</strong> ${email}</p>
                      <p><strong>Password:</strong> ${plainPassword}</p>
                      <br/>
                      <p>You can now log in to your account.</p>
                      <p>– Livora Team</p>
                    `,
            });
    } catch (mailErr) {
      console.error("Failed to send welcome email:", mailErr);
    }

    res.status(201).json({ savedUser });
  } catch (error) {
    console.error("Error in createUser controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      recoveryEmail,
      phoneNo,
      secondaryPhoneNo,
      password,
      role,
      apartmentNo,
      residentType,
      staffType,
      dateOfBirth,
      job,
      emergencyContactName,
      emergencyContactNumber,
      familyMembers,
      medicalConditions,
    } = req.body;

    // Prevent duplicate apartment number for residents
    if (role === "Resident" && apartmentNo) {
      const existingResident = await User.findOne({ apartmentNo, _id: { $ne: req.params.id } });
      if (existingResident) {
        return res.status(400).json({ message: "Apartment number already registered." });
      }
    }

    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (recoveryEmail !== undefined) updateData.recoveryEmail = recoveryEmail;
    if (phoneNo !== undefined) updateData.phoneNo = phoneNo;
    if (secondaryPhoneNo !== undefined) updateData.secondaryPhoneNo = secondaryPhoneNo;
    if (role !== undefined) updateData.role = role;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (job !== undefined) updateData.job = job;
    if (emergencyContactName !== undefined) updateData.emergencyContactName = emergencyContactName;
    if (emergencyContactNumber !== undefined) updateData.emergencyContactNumber = emergencyContactNumber;
    if (familyMembers !== undefined) updateData.familyMembers = familyMembers;
    if (medicalConditions !== undefined) updateData.medicalConditions = medicalConditions;

    if (role === "Resident") {
      if (apartmentNo !== undefined) updateData.apartmentNo = apartmentNo;
      if (residentType !== undefined) updateData.residentType = residentType;
    }

    if (role === "Staff" && staffType !== undefined) {
      updateData.staffType = staffType;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ updatedUser });
  } catch (error) {
    console.error("Error in updateUser controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



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
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    if (user.twoFactorEnabled) {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore[user._id] = { otp, expiresAt: Date.now() + OTP_EXPIRY };

      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"LIVORA" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Your OTP code",
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      });

      return res.json({ message: "OTP sent to email", userId: user._id, twoFactorEnabled: true });
    } else {
      // Skip OTP and issue JWT directly
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
      return res.json({
        message: "Login successful",
        user,
        token,
        twoFactorEnabled: false,
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
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
                    userId: user.userId, 
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


export const getResidentByApartment = async (req, res) => {
  try {
    const { apartmentNo } = req.params;

    if (!apartmentNo) {
      return res.status(400).json({ message: "Apartment number is required" });
    }

    const resident = await User.findOne({ apartmentNo })
      .select("firstName")
      .lean();

    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }

    res.status(200).json(resident);
  } catch (error) {
    console.error("Error in getResidentByApartment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 

export const forgotPassword = async (req, res) => {
    try {
        // Get user from authenticated token (req.user is set by authMiddleware)
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + RESET_TOKEN_EXPIRY_MS;

        await user.save();

        const transporter = createTransporter();

        const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${rawToken}`;

        await transporter.sendMail({
            from:`"LIVORA" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password reset for your account",
            text: `Hello ${user.firstName},\n\nYou requested a password reset. Click this link (or paste in browser): ${resetLink}\n\nThis link is valid for 15 minutes.\n\nIf you didn't request this, please ignore this email.\n\n- Livora Team`,
            html: `
                <h2>Password Reset Request</h2>
                <p>Hello <strong>${user.firstName}</strong>,</p>
                <p>You requested a password reset for your Livora account.</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #6b7280;">${resetLink}</p>
                <p><strong>This link is valid for 15 minutes.</strong></p>
                <p>If you didn't request this password reset, please ignore this email.</p>
                <p>– Livora Team</p>
            `
        });

        return res.status(200).json({ 
            message: "Password reset link has been sent to your email",
            email: user.email // Return the email for confirmation
        });

    } catch (err) {
        console.error("forgotPassword error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const checkEmailExists = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email required" });

        const user = await User.findOne({ email });
        
        return res.status(200).json({ 
            exists: !!user,
            message: user ? "Email found" : "Email not found"
        });

    } catch (err) {
        console.error("checkEmailExists error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const forgotPasswordUnauthenticated = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email required" });

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email not found in our system" });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + RESET_TOKEN_EXPIRY_MS;

        await user.save();

        const transporter = createTransporter();

        const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${rawToken}`;

        await transporter.sendMail({
            from:`"LIVORA" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password reset for your account",
            text: `Hello ${user.firstName},\n\nYou requested a password reset. Click this link (or paste in browser): ${resetLink}\n\nThis link is valid for 15 minutes.\n\nIf you didn't request this, please ignore this email.\n\n- Livora Team`,
            html: `
                <h2>Password Reset Request</h2>
                <p>Hello <strong>${user.firstName}</strong>,</p>
                <p>You requested a password reset for your Livora account.</p>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #6b7280;">${resetLink}</p>
                <p><strong>This link is valid for 15 minutes.</strong></p>
                <p>If you didn't request this password reset, please ignore this email.</p>
                <p>– Livora Team</p>
            `
        });

        return res.status(200).json({ 
            message: "Password reset link has been sent to your email",
            email: user.email
        });

    } catch (err) {
        console.error("forgotPasswordUnauthenticated error:", err);
        console.error("Full error details:", err);
        return res.status(500).json({ 
            message: "Server error", 
            details: err.message 
        });
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
                from: `"LIVORA " <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: "Your password has been changed",
                text: `Your password was successfully changed. If you did not do this, contact support immediately.`,    
            });
        } catch (e) {
            console.warn("Failed sending confirmation email:", e);
        }

        const notification = {
          userId: user._id.toString(),
          title: "Password Updated",
          message: "Your account password was changed successfully.",
          createdAt: new Date(),
          isRead: false,
        };

        await Notification.create(notification);  // Save in DB
        emitNotification(notification); 

        return res.status(200).json({ message: "Password reset successful" });

    } catch (err) {
        console.error("resetPassword error:", err);
        return res.status(500).json({ message: "Server error"});
    }
};


export const changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 1. Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update user
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    // (Optional) Invalidate existing sessions/tokens here if you’re using JWT
    
    const notification = {
      userId: user._id.toString(),
      title: "Password Updated",
      message: "Your account password was changed successfully.",
      createdAt: new Date(),
      isRead: false,
    };

    await Notification.create(notification);  // Save in DB
    emitNotification(notification);   

    return res.json({
      success: true,
      message: "Password changed successfully",
    });


  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const send2FAOtp = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // req.user is set by authMiddleware
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[user._id] = { otp, expiresAt: Date.now() + OTP_EXPIRY };

    // Send OTP via email
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"LIVORA" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your 2FA Setup OTP Code",
      text: `Your OTP code for setting up two-factor authentication is ${otp}. It will expire in 5 minutes.`,
      html: `
        <h2>Two-Factor Authentication Setup</h2>
        <p>Hello ${user.firstName},</p>
        <p>Your OTP code for setting up two-factor authentication is:</p>
        <h3 style="color: #2563eb; font-size: 24px; letter-spacing: 2px;">${otp}</h3>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>– Livora Team</p>
      `
    });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Send 2FA OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const toggleTwoFactor = async (req, res) => {
  const { enabled, otp } = req.body; // true or false, and optional OTP for verification
  try {
    const user = await User.findById(req.user._id); // req.user is set by authMiddleware
    if (!user) return res.status(404).json({ message: "User not found" });

    // If enabling 2FA, verify OTP first
    if (enabled && otp) {
      const record = otpStore[user._id];
      if (!record) return res.status(400).json({ message: "No OTP found" });

      if (Date.now() > record.expiresAt) {
        delete otpStore[user._id];
        return res.status(400).json({ message: "OTP expired" });
      }

      if (record.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // OTP is valid, clean up
      delete otpStore[user._id];
    }

    user.twoFactorEnabled = enabled;
    await user.save();

    const notification = {
      userId: user._id.toString(),
      title: "Two-Factor Authentication",
      message: enabled
        ? "You have successfully enabled Two-Factor Authentication for your account."
        : "You have disabled Two-Factor Authentication for your account.",
      createdAt: new Date(),
      isRead: false,
    };

    await Notification.create(notification); // Save notification in DB
    emitNotification(notification);

    res.json({ 
      message: `Two-factor authentication ${enabled ? "enabled" : "disabled"}`, 
      twoFactorEnabled: enabled 
    });
  } catch (err) {
    console.error("Toggle 2FA error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Return current 2FA status for the authenticated user
export const getTwoFactorStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("twoFactorEnabled");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ twoFactorEnabled: !!user.twoFactorEnabled });
  } catch (err) {
    console.error("getTwoFactorStatus error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      {
        profilePicture: {
          data: req.file.buffer,
          contentType: req.file.mimetype
        }
      },
      { new: true }
    ).select("-profilePicture.data");

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Failed to update profile picture" });
  }
};

export const getProfilePicture = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user || !user.profilePicture || !user.profilePicture.data) {
      return res.status(404).send("No profile picture found");
    }

    // Prevent browsers/CDNs from caching stale avatars
    res.set("Content-Type", user.profilePicture.contentType);
    res.set("Cache-Control", "private, max-age=0, no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.send(user.profilePicture.data);
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    res.status(500).send("Failed to fetch profile picture");
  }
};

export const deleteProfilePicture = async (req, res) => {
  try {
    const { userId } = req.params;

    // Unset the profilePicture field based on app-level userId (e.g., R001)
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $unset: { profilePicture: "" } },
      { new: true }
    ).select("-profilePicture.data");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "Profile picture deleted successfully", user: updatedUser });
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get resident dashboard statistics
export const getResidentDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id; // Mongo ObjectId of logged-in user

    // Load user for derived fields like apartmentNo and app-level userId
    const user = await User.findById(userId).select("apartmentNo userId");

    // 1) Total feedbacks created by this resident
    const totalFeedbacks = await Feedback.countDocuments({ userId });

    // 2) Active services (Pending or Processing) for this resident
    const activeServices = await GKServiceRequest.countDocuments({
      userId,
      status: { $in: ["Pending", "Processing"] },
    });

    // 3) Total bookings made by this resident
    const totalBookings = await ConventionHallBooking.countDocuments({
      userId: userId.toString(),
    });

    // 5) Unpaid bills for this resident (support stored id as app userId or ObjectId string)
    // Build an array of possible resident identifiers
    const residentIdentifiers = [
      user?.userId,           // e.g. "R001"
      userId?.toString(),     // MongoDB ObjectId
    ].filter(Boolean);

    const unpaidBills = await Payment.countDocuments({
      residentId: { $in: residentIdentifiers },
      status: "Pending",
    });

    res.status(200).json({
      totalFeedbacks,
      activeServices,
      totalBookings,
      unpaidBills,
    });
  } catch (error) {
    console.error("Error in getResidentDashboardStats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
