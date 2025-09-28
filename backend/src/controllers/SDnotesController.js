import Note from '../models/SDNote.js';


export async function getAllNotes (req,res){ 
   
  try {
      const notes = await Note.find().sort({createAt: -1}); // Fetch all notes from the database
      res.status(200).json(notes); // Send the notes as a JSON response
   } catch (error) {
      console.error("Error in getAllnotes controller:", error);
      res.status(500).json({ message: "Internal server error"});
}
}





export async function getNotebyId (req,res){ 
  try {
      const note = await Note.findById(req.params.id); // Fetch the note by ID from the database

      if(!note) return res.status(404).json({message:"note not found"});
      res.status(200).json(note); // Send the note as a JSON response

   } catch (error) { 
      console.error("Error in getNotebyId controller:", error);
      res.status(500).json({ message: "Internal server error"});  
   }
}

export async function createNotes (req,res){ 
   try{
      const { title, content } = req.body; // Destructure title and content from the request body
      const note = new Note({title, content }); // Create a new note instance

      const savedNote =await note.save(); // Save the new note to the database
      res.status(201).json(savedNote); 
   
   } catch (error) {
       console.error("Error in createNotes controller:", error);
      res.status(500).json({ message: "Internal server error"});
}

}


export async function updatedNotes (req,res){ 
  try {
    const {title,content} = req.body
   const updatedNotes= await Note.findByIdAndUpdate(req.params.id,{title,content},
   {new:true}  
   );
   
    if(!updatedNotes) return res.status(404).json({message:"note not found"});

    res.status(200).json({updatedNotes});
  }

  catch (error) {
      console.error("Error in updateNotes controller:", error);
      res.status(500).json({ message: "Internal server error"});
 
}

}


export async function deleteNotes (req,res){ 
  try {
   const deletedNotes = await Note.findByIdAndDelete(req.params.id, { new: true });

    if(!deletedNotes) return res.status(404).json({message:"note not found"});

    res.status(200).json({message:"note deleted successfully"});
  }

  catch (error) {
      console.error("Error in deleteNotes controller:", error);
      res.status(500).json({ message: "Internal server error"});

}

}


