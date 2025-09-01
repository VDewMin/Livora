import express from "express";
import { createUser, deleteUser, getAllUsers, updateUser } from "../controllers/vd_usersController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id")
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
