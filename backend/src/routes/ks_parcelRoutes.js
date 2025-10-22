import express from "express";
import {
  deleteParcel,
  getAllParcels,
  createParcels,
  updateParcel,
  getParcelById,
  verifyParcelQr,
  getParcelCounts,
  getParcelsOverTime,
  getStatusDistribution,
  getParcelsPerApartment,
  getAllSlots 

} from "../controllers/ks_parcelController.js";

const router = express.Router();

router.get("/verify", verifyParcelQr);
router.get("/", getAllParcels);

router.get("/parcelCounts", getParcelCounts);
router.get("/parcelsOverTime", getParcelsOverTime);
router.get("/statusDistribution", getStatusDistribution);
router.get("/parcelsPerApartment", getParcelsPerApartment);

router.get("/slots", getAllSlots);

router.get("/:id", getParcelById);
router.post("/", createParcels);
router.put("/:id", updateParcel);
router.delete("/:id", deleteParcel);

export default router;