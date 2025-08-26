import express from "express";
import {
  deleteParcel,
  getAllParcels,
  createParcels,
  updateParcel,
  getParcelById,
} from "../controllers/ks_parcelController.js";

const router = express.Router();

router.get("/", getAllParcels);
router.get("/:id", getParcelById);
router.post("/", createParcels);
router.put("/:id", updateParcel);
router.delete("/:id", deleteParcel);

export default router;