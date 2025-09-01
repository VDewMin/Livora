import mongoose from "mongoose"
import Counter from "./counter.js";


const parcelSchema = new mongoose.Schema({
     parcelId: {
      type: String,
      unique: true, 
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
      enum: ["Normal", "Documents", "Electronics"],
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
      enum: ["Pending", "Collected", "Removed"],
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


parcelSchema.pre("save", async function (next) {
  try {
    // Only generate parcelId if it is not already set
    if (!this.parcelId) {
      let counter = await Counter.findOne({ name: "parcel" });
      
      // Initialize counter if missing
      if (!counter) {
        counter = await Counter.create({ name: "parcel", seq: 0 });
      }

      // Increment counter
      counter.seq += 1;
      await counter.save();

      // Set parcelId
      this.parcelId = "P" + counter.seq.toString().padStart(3, "0");
    }

    next();
  } catch (err) {
    console.error("Error in pre-save hook:", err);
    next(err);
  }
});





const Parcel = mongoose.model("Parcel", parcelSchema)

export default Parcel;