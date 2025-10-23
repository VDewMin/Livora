import Parcel from "../models/ks_Parcel.js";
import QRCode from "qrcode";
import { makeVerifyUrl } from "../utils/parcelVerify.js";
import { decodeVerifyToken } from "../utils/parcelVerify.js";
import { transporter } from "../config/mail.js";
import mongoose from "mongoose";
import User from "../models/vd_user.js";
import Notification from "../models/vd_notification.js";
import { emitNotification } from "../utils/vd_emitNotification.js";
import { getIO } from "../socket.js";

export const getAllParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find().sort({ createdAt: -1 });
    res.status(200).json(parcels);
  } catch (error) {
    console.error("Error in getAllParcels Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getParcelById = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ message: "Parcel not found" });
    res.json(parcel);
  } catch (error) {
    console.error("Error in getParcelById Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createParcels = async (req, res) => {
  try {
    const {
      residentName,
      apartmentNo,
      parcelType,
      parcelDescription,
      courierService,
      locId,
      status,
      receivedByStaff,
      collectedDateTime,
      collectedByName,
    } = req.body;

    const existingParcel = await Parcel.findOne({ locId, status: { $nin: ["Collected", "Removed"] } });
    if (existingParcel) {
      return res.status(400).json({ message: "This slot is already occupied!" });
    }

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
      collectedByName,
    });

    const savedParcel = await newParcel.save();

    const io = getIO();
    io.emit("slotUpdated", { locId, status: "Occupied" });

    //generate a secure url with loc id and parcelId that the qr code  link to
    const { url: verifyUrl } = makeVerifyUrl(
      savedParcel.parcelId,
      savedParcel.locId
    );
    let qr = null;
    try {
      const imgDataUrl = await QRCode.toDataURL(verifyUrl, {
        errorCorrectionLevel: "M", //quality
        margin: 1,
        scale: 6, // size
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
      let recipientUser = null;

      if (
        savedParcel.residentId &&
        mongoose.isValidObjectId(savedParcel.residentId)
      ) {
        recipientUser = await User.findById(savedParcel.residentId);
      }

      if (!recipientUser && savedParcel.apartmentNo) {
        recipientUser = await User.findOne({
          apartmentNo: savedParcel.apartmentNo,
        });
      }

      if (!recipientUser) {
        console.warn("No resident found for parcel:", savedParcel.parcelId);
      } else {
        const notification = {
          userId: recipientUser._id.toString(),
          title: "New Parcel Arrived",
          message: "Your parcel has arrived. Please collect it from the lobby.",
          createdAt: new Date(),
          isRead: false,
        };

        await Notification.create(notification);
        emitNotification(notification);
      }
    } catch (error) {
      console.error("Error creating in-app notification:", error);
    }

    try {
      let recipientEmail = null;

      if (
        savedParcel.residentId &&
        mongoose.isValidObjectId(savedParcel.residentId)
      ) {
        const userById = await User.findById(savedParcel.residentId).lean();
        if (userById?.email) recipientEmail = userById.email;
      }

      if (!recipientEmail && savedParcel.apartmentNo) {
        const userByApt = await User.findOne({
          apartmentNo: savedParcel.apartmentNo,
        }).lean();
        if (userByApt?.email) recipientEmail = userByApt.email;
      }

      const toAddress = recipientEmail;

      if (!toAddress) {
        console.warn(
          "No recipient email found for parcel:",
          savedParcel.parcelId
        );
      } else {
        const { verifyUrl: verifyHref } = savedParcel.qr || {};
        const mailOptions = {
          from: `"LIVORA" <${process.env.EMAIL_USER}>`,
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
              cid: "parcelqr",
            },
          ],
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", {
          to: toAddress,
          messageId: info?.messageId,
          response: info?.response,
        });
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
    return res.status(400).json({ valid: false, message: "Invalid QR code" }); //if the qr code token is invalid or missing
  }

  res.json({
    success: true,
    parcelId: decoded.parcelId,
    locId: decoded.locId,
  });
};

export const updateParcel = async (req, res) => {
  try {
    const {
      parcelDescription,
      locId,
      status,
      collectedDateTime,
      collectedByName,
    } = req.body;

    const updatedParcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      { parcelDescription, locId, status, collectedByName, collectedDateTime },
      { new: true }
    );

    if (!updatedParcel)
      return res.status(404).json({ message: "Parcel not found" });


    let residentUser = null;

    if (
      updatedParcel.residentId &&
      mongoose.isValidObjectId(updatedParcel.residentId)
    ) {
      residentUser = await User.findById(updatedParcel.residentId);
    }

    if (!residentUser && updatedParcel.apartmentNo) {
      residentUser = await User.findOne({
        apartmentNo: updatedParcel.apartmentNo,
      });
    }

    if (residentUser) {
      let message = "";

      switch (updatedParcel.status) {
        case "Collected":
          message = "Your parcel has been collected successfully.";
          break;
        case "Removed":
          message = "Your parcel has been removed from the lobby.";
          break;
      }

      const notification = {
        userId: residentUser._id.toString(),
        title: "Parcel Status Updated",
        message,
        createdAt: new Date(),
        isRead: false,
      };

      await Notification.create(notification);
      emitNotification(notification);
    } else {
      console.warn("Resident not found for updated parcel:", updatedParcel._id);
    }

    // Emit slot update to front-end
    const io = getIO();
    if (["Collected", "Removed"].includes(updatedParcel.status)) {
      io.emit("slotUpdated", {
        locId: updatedParcel.locId,
        status: "Available",
      });
    }


    res.status(200).json({ updatedParcel });
  } catch (error) {
    console.error("Error in updateParcel Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteParcel = async (req, res) => {
  try {
    const deletedParcel = await Parcel.findByIdAndDelete(req.params.id);
    if (!deletedParcel)
      return res.status(404).json({ message: "Parcel not found" });

    res.status(200).json({ message: "Parcel deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteParcel Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

export const getParcelsOverTime = async (req, res) => {
  try {
    const data = await Parcel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$arrivalDateTime" },
          },

          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const result = data.map((item) => ({
      date: item._id,
      count: item.count,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getParcelsOverTime:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStatusDistribution = async (req, res) => {
  try {
    const data = await Parcel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const result = {
      pending: data.find((d) => d._id === "Pending")?.count || 0,
      collected: data.find((d) => d._id === "Collected")?.count || 0,
      removed: data.find((d) => d._id === "Removed")?.count || 0,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getStatusDistribution:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getParcelsPerApartment = async (req, res) => {
  try {
    const data = await Parcel.aggregate([
      { $group: { _id: "$apartmentNo", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }, // top 10 apartments
    ]);

    const result = data.map((item) => ({
      apartment: item._id,
      count: item.count,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getParcelsPerApartment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllSlots = async (req, res) => {
  try {
    const parcels = await Parcel.find({ status: { $nin: ["Collected", "Removed"] } }); 
    console.log("Parcels fetched:", parcels); // <-- log

    const occupied = parcels.map((p) => p.locId);
    console.log("Occupied locIds:", occupied);

    const slots = Array.from({ length: 50 }, (_, i) => {
      const locId = `L${i + 1}`;
      return {
        locId,
        status: occupied.includes(locId) ? "Occupied" : "Available",
      };
    });

    res.json(slots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: "Failed to load slots" });
  }
};
