import Parcel from "../models/ks_Parcel.js"
import QRCode from "qrcode"
import {makeVerifyUrl} from "../utils/parcelVerify.js"
import { decodeVerifyToken } from "../utils/parcelVerify.js";
import { transporter  } from "../config/mail.js"
import mongoose from "mongoose"
import User from "../models/vd_user.js"

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

export const createParcels = async (req, res) => {
  try {
    const { residentName, apartmentNo, parcelType, parcelDescription, courierService, locId, status, receivedByStaff, collectedDateTime, collectedByName } = req.body;

   
    const newParcel = new Parcel({
      residentName,
      apartmentNo,
      parcelType,
      parcelDescription,
      courierService,
      locId,
      status,
      receivedByStaff,
      collectedDateTime,
      collectedByName
    });

    const savedParcel = await newParcel.save();

    const { url: verifyUrl } = makeVerifyUrl(savedParcel.parcelId , savedParcel.locId);
    let qr = null;
    try {
      const imgDataUrl = await QRCode.toDataURL(verifyUrl, {
        errorCorrectionLevel: "M",
        margin: 1,
        scale: 6
      });

      savedParcel.qr = { verifyUrl, imgDataUrl };
      await savedParcel.save();

      qr = imgDataUrl;
    } catch (qrError) {
      console.error("Error generating QR code:", qrError);
     
      try {
        savedParcel.qr = { verifyUrl };
        await savedParcel.save();
      } catch {}
    }

   
    try {
      let recipientEmail = null;

      
      if (savedParcel.residentId && mongoose.isValidObjectId(savedParcel.residentId)) {
        const userById = await User.findById(savedParcel.residentId).lean();
        if (userById?.email) recipientEmail = userById.email;
      }

      
      if (!recipientEmail && savedParcel.apartmentNo) {
        const userByApt = await User.findOne({ apartmentNo: savedParcel.apartmentNo }).lean();
        if (userByApt?.email) recipientEmail = userByApt.email;
      }

      
      const toAddress = recipientEmail || process.env.TEST_FALLBACK_EMAIL || "kaveeshasandeepani027@gmail.com";

      if (!toAddress) {
        console.warn("No recipient email found for parcel:", savedParcel.parcelId);
      } else {
        const { verifyUrl: verifyHref } = savedParcel.qr || {};
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: toAddress,
          subject: "Parcel arrival notification with QR",
          html: `
            <p>Dear ${savedParcel.residentName || "Resident"},</p>
            <p>You have a new parcel waiting for collection.</p>
            <p>Please scan the QR code below to verify and proceed:</p>
            <img src="cid:parcelqr" style="max-width:250px;" />
            <p>If you have any issues, please contact the security desk.</p>
          `,
          attachments: [
            {
              filename: "parcel-qr.png",
              content: qr.replace(/^data:image\/png;base64,/, ""), 
              encoding: "base64",
              cid: "parcelqr" 
            }
          ]
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", { to: toAddress, messageId: info?.messageId, response: info?.response });
      }
    } catch (emailError) {
      console.error("Email transporter error:", emailError);
    }

    res.status(201).json({ parcel: savedParcel });

  } catch (error) {
    console.error("Error in createParcel Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyParcelQr = (req, res) => {
  const { token } = req.query;
  const decoded = decodeVerifyToken(token);

  if (!decoded) {
    return res.status(400).json({ valid: false, message: "Invalid QR code" });
  }

  res.json({
    success: true,
    parcelId: decoded.parcelId,
    locId: decoded.locId,
  });
};

export const updateParcel = async(req, res) => {
    try {
        const { parcelDescription, locId, status, collectedDateTime, collectedByName} = req.body
        const updatedParcel = await Parcel.findByIdAndUpdate(req.params.id, {parcelDescription, locId, status, collectedByName, collectedDateTime}, {new: true,})
        
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

export const getParcelCounts = async (req, res) => {
  try {
    const total = await Parcel.countDocuments();
    const pending = await Parcel.countDocuments({ status: "Pending" });
    const collected = await Parcel.countDocuments({ status: "Collected" });
    const removed = await Parcel.countDocuments({ status: "Removed" });

    console.log("Counts:", { total, pending, collected, removed });
    res.status(200).json({ total, pending, collected, removed });
  } catch (error) {
    console.error("Error in getParcelCounts Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
