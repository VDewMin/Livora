import express from "express";
import {
  deleteParcel,
  getAllParcels,
  createParcels,
  updateParcel,
  getParcelById,
  verifyParcelQr
} from "../controllers/ks_parcelController.js";

const router = express.Router();

router.get("/verify", verifyParcelQr);
router.get("/", getAllParcels);
router.get("/:id", getParcelById);
router.post("/", createParcels);
router.put("/:id", updateParcel);
router.delete("/:id", deleteParcel);

export default router;