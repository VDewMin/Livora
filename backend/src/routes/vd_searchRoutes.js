import express from "express";
import { globalSearch } from "../controllers/vd_searchController.js";

const router = express.Router();
router.get("/:userId", globalSearch);

export default router;