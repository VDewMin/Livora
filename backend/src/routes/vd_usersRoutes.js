import express from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser, loginUser,verifyOtp,forgotPassword, forgotPasswordUnauthenticated, checkEmailExists, resetPassword, getResidentByApartment, changePassword, updateProfilePicture, deleteProfilePicture, getResidentDashboardStats, toggleTwoFactor, send2FAOtp } from "../controllers/vd_usersController.js";
import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/vd_profilePicUpload.js";
import { getProfilePicture } from "../controllers/vd_usersController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllUsers);
router.get("/resident/:apartmentNo", getResidentByApartment);
router.get("/:id", authMiddleware, getUserById)
router.post("/", createUser);
router.put("/:id", authMiddleware ,updateUser);
router.delete("/:id", authMiddleware, deleteUser);

router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", authMiddleware, forgotPassword);
router.post("/forgot-password-unauthenticated", forgotPasswordUnauthenticated);
router.post("/check-email", checkEmailExists);
router.post("/reset-password", resetPassword);
router.post("/change-password", changePassword);

router.put("/:userId/profile-picture", upload.single("profilePicture"), updateProfilePicture);
router.get("/:userId/profile-picture", getProfilePicture);
router.delete("/:userId/profile-picture", deleteProfilePicture);

router.post("/toggle-2fa", authMiddleware, toggleTwoFactor);
router.post("/send-2fa-otp", authMiddleware, send2FAOtp);

// Resident dashboard route
router.get("/dashboard/stats", authMiddleware, getResidentDashboardStats);

export default router;
