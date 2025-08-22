import Parcel from "../models/ks_Parcel.js"

export const getAllParcels = async(req, res) => {
    try {
        const parcels = await Parcel.find()
        res.status(200).json(parcels)

    } catch (error) {
        console.error("Error in getAllParcels Controller", error) 
        res.status(500).json({message : "Internal server error"})

    }
}

/* another way
export function getAllParcels (req, res){
    res.status(200).send("You just fetch the parcels")
} */

export const getParcelById = async(req,res) => {
    try {
        const parcel = await Parcel.findById(req.params.id)
        if(!parcel) return res.status(404).json({message: "Parcel not found"})
        res.json(parcel)

    } catch (error) {
        console.error("Error in getParcelById Controller", error) 
        res.status(500).json({message : "Internal server error"})
    }
}

export const createParcels = async(req, res) => {
    try {
        const {parcelId, residentName, residentId, apartmentNo, parcelType, parcelDescription, courierService, status, arrivalDateTime, receivedByStaff, collectedDateTime, collectedByName} = req.body
        const newParcel = new Parcel({parcelId, residentName, residentId, apartmentNo, parcelType, parcelDescription, courierService, status, arrivalDateTime, receivedByStaff, collectedDateTime, collectedByName})

        const savedParcel = await newParcel.save();
        res.status(201).json({savedParcel})
    } catch (error) {
        console.error("Error in createParcel Controller", error) 
        res.status(500).json({message : "Internal server error"}) 
    }
}

export const updateParcel = async(req, res) => {
    try {
        const {parcelId, residentName, residentId, apartmentNo, parcelType, parcelDescription, courierService, status, arrivalDateTime, receivedByStaff, collectedDateTime, collectedByName} = req.body
        const updatedParcel = await Parcel.findByIdAndUpdate(req.params.id, {parcelDescription, status, collectedByName}, {new: true,})
        
        if(!updatedParcel) return res.status(404).json({message: "Parcel not found"})
        res.status(200).json({updatedParcel});
    } catch (error) {
        console.error("Error in updateParcel Controller", error) 
        res.status(500).json({message : "Internal server error"})
    }
}

export const deleteParcel = async(req, res) => {
    try {
        const deletedParcel = await Parcel.findByIdAndDelete(req.params.id)
        if(!deletedParcel) return res.status(404).json({message: "Parcel not found"})

        res.status(200).json({message : "Parcel deleted successfully!"});
    } catch (error) {
        console.error("Error in deleteParcel Controller", error) 
        res.status(500).json({message : "Internal server error"})
    }
  
}