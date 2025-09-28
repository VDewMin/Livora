import mongoose from "mongoose";

//1- Define the schema
//2- Create the model

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
    

}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Note = mongoose.model("Note", noteSchema);    

export default Note; 

