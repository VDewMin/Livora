import express from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser, loginUser,verifyOtp,forgotPassword, resetPassword, getResidentByApartment } from "../controllers/vd_usersController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getAllUsers);
router.get("/resident/:apartmentNo", getResidentByApartment);
router.get("/:id", authMiddleware, getUserById)
router.post("/", createUser);
router.put("/:id", authMiddleware ,updateUser);
router.delete("/:id", deleteUser);

router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


export default router;
