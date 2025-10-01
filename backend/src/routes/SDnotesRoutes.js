import express from "express"
import { createNotes, deleteNotes, getAllNotes, getNotebyId, updatedNotes } from "../controllers/SDnotesController.js";


const router = express.Router();

router.get("/",getAllNotes);
router.get("/:id",getNotebyId);
router.post("/",createNotes);
router.put("/:id",updatedNotes);
router.delete("/:id",deleteNotes); 
 

 export default router;






 
// app.get("/api/notes", (req,res)=>{ //endpoint 
//     res.status(200).send("heloow");
// });

// app.post("/api/notes", (req,res)=> {
//     res.status(201).json({massage:"post created successfully"})
// });

// app.put("/api/notes/:id", (req,res)=> {
//     res.status(200).json({massage:"post updated successfully"})
// });

// app.delete("/api/notes/:id", (req,res)=> {
//     res.status(200).json({massage:"post deleted successfully"})
// });