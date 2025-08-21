import express from "express";
import {
  deleteParcel,
  getAllParcels,
  createParcels,
  updateParcel,
} from "../controllers/ks_parcelController.js";

const router = express.Router();

router.get("/", getAllParcels);

router.post("/", createParcels);

router.put("/:id", updateParcel);

router.delete("/:id", deleteParcel);

export default router;