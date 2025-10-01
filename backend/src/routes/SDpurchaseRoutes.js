import express from "express"
import { createpurchase, deletepurchase, getAllpurchase, getpurchasebyId, updatedpurchase } from "../controllers/SDpurchaseController.js";


const router = express.Router();

router.get("/",getAllpurchase);
router.get("/:id",getpurchasebyId);
router.post("/",createpurchase);
router.put("/:id",updatedpurchase);
router.delete("/:id",deletepurchase); 
 

 export default router;
