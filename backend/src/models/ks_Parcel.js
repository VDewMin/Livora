import mongoose from "mongoose"

const parcelSchema = new mongoose.Schema({
     parcelId: {
      type: String,
      required: true,
      unique: true, // System-generated unique parcel ID
    },

     residentName: {
      type: String,
      required: true,
    },

    residentId: {
      type: String,
      required: true,
    },

    apartmentNo: {
      type: String,
      required: true,
    },

    parcelType: {
      type: String,
      enum: ["Normal", "Food", "Documents"],
      required: true,
    },

    parcelDescription: {
      type: String,
      default: "",
    },

    courierService: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Picked Up", "Removed"],
      default: "Pending",
    },

    arrivalDateTime: {
      type: Date,
      default: Date.now, // Automatically logs arrival time
    },

    receivedByStaff: {
      type: String,
      required: true, // Auto from staff login session
    },

    collectedDateTime: {
      type: Date,
      default: null,
    },

    collectedByName: {
      type: String,
      default: null, 
    },

},
{timestamps:true} //createdAt, updatedAt
)

const Parcel = mongoose.model("Parcel", parcelSchema)

export default Parcel;