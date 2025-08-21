import Parcel from "../models/ks_Parcel.js"

export const getAllParcels = async (req, res) => {
    try {
        const parcels = await Parcel.find()
        res.status(200).json(parcels)

    } catch (error) {
        console.error("Error in getAllNotes Controller", error) 
        res.status(500).json({message : "Internal server error"})
    }
}

/* another way
export function getAllParcels (req, res){
    res.status(200).send("You just fetch the parcels")
} */

export const logParcels = (req, res) => {
    res.status(201).json({message : "Parcel added successfully!"});
}

export const updateParcel = (req, res) => {
  res.status(200).json({message : "Parcel updated successfully!"});
}

export const deleteParcel = (req, res) => {
  res.status(200).json({message : "Parcel deleted successfully!"});
}