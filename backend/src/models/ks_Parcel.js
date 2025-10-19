import mongoose from "mongoose"
import Counter from "./counter.js";


const parcelSchema = new mongoose.Schema({
     parcelId: {
      type: String,
      unique: true, 
    },

     residentName: {
      type: String,
      required: true
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

    locId:{
      type: String,
      required: true,
      //match: [/^L([1-9]|[1-4][0-9]|50)$/, "Invalid Location ID. Must be L1 to L50"],
    },

    status: {
      type: String,
      enum: ["Pending", "Collected", "Removed"],
      default: "Pending",
    },

    arrivalDateTime: {
      type: Date,
      default: Date.now,
    },

    receivedByStaff: {
      type: String,
      required: true, 
    },

    collectedDateTime: {
      type: Date,
      default: null,
    },

    collectedByName: {
      type: String,
      default: null, 
    },

    qr: {
      verifyUrl: String,  //link that qr code points
      imgDataUrl: String  // store image as a encoded string
    }

},
{timestamps:true} //createdAt, updatedAt
)


parcelSchema.pre("save", async function (next) {
  try {
    if (!this.parcelId) {
      let counter = await Counter.findOne({ name: "parcel" });
      
      if (!counter) {
        counter = await Counter.create({ name: "parcel", seq: 0 });
      }

      counter.seq += 1;
      await counter.save();

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