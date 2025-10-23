import cron from "node-cron";
import Parcel from "../models/ks_Parcel.js";
import User from "../models/vd_user.js";
import Notification from "../models/vd_notification.js";
import { emitNotification } from "../utils/vd_emitNotification.js";
import { transporter } from "../config/mail.js";
import ParcelNotificationLog from "../models/ks_parcelNotification.js";

const sendParcelEmail = async (residentEmail, subject, message, qr) => {
  if (!residentEmail) return;
  try {
    const mailOptions = {
      from: `"LIVORA" <${process.env.EMAIL_USER}>`,
      to: residentEmail,
      subject,
      html: `<p>${message}</p>`,
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending parcel email:", err);
  }
};

export const sendParcelReminders = async () => {
  try {
    const now = new Date();
    const parcels = await Parcel.find({ status: "Pending" });

    for (const parcel of parcels) {
      const daysInLobby = Math.floor(
        (now - parcel.arrivalDateTime) / (1000 * 60 * 60 * 24)
      );

      // Find resident
      let resident = null;
      if (parcel.residentId) {
        resident = await User.findById(parcel.residentId).lean();
      }
      if (!resident && parcel.apartmentNo) {
        resident = await User.findOne({
          apartmentNo: parcel.apartmentNo,
        }).lean();
      }
      if (!resident) continue;

      const residentEmail = resident.email;

      // 4-day notification
      if (daysInLobby >= 4) {
        const alreadySent = await ParcelNotificationLog.findOne({
          parcelId: parcel.parcelId,
          type: "4day",
        });
        if (!alreadySent) {
          const message = `Your parcel received on is still in the lobby. Please collect it at your earliest convenience. The QR code you received will remain valid until its expiry.`;
          const notification = {
            userId: resident._id,
            title: "Parcel awaiting collection",
            message,
            createdAt: new Date(),
            isRead: false,
          };
          await Notification.create(notification);
          emitNotification("receiveNotification", notification);
          await sendParcelEmail(
            residentEmail,
            "Parcel awaiting collection",
            message,
            parcel.qr?.imgDataUrl
          );
          await ParcelNotificationLog.create({
            parcelId: parcel.parcelId,
            type: "4day",
          });
        }
      }

      // 10-day notification
      if (daysInLobby >= 10) {
        const alreadySent = await ParcelNotificationLog.findOne({
          parcelId: parcel.parcelId,
          type: "10day",
        });
        if (!alreadySent) {
          const message = `Your parcel has been in the lobby for 10 days. Please collect it within the next 4 days. After 14 days, it will be removed from storage.`;
          const notification = {
            userId: resident._id,
            title: "Parcel Final Reminder",
            message,
            createdAt: new Date(),
            isRead: false,
          };
          await Notification.create(notification);
          emitNotification("receiveNotification", notification);

          await sendParcelEmail(
            residentEmail,
            "Parcel Final Reminder",
            message,
            parcel.qr?.imgDataUrl
          );

          await ParcelNotificationLog.create({
            parcelId: parcel.parcelId,
            type: "10day",
          });
        }
      }

      // 14-day notification
      if (daysInLobby >= 14) {
        const alreadySent = await ParcelNotificationLog.findOne({
          parcelId: parcel.parcelId,
          type: "14day",
        });
        if (!alreadySent) {
          const messageResident =
            "Your parcel has been removed from the lobby.";
          const messageStaff = `Parcel ${parcel.parcelId} at slot ${parcel.locId} has been removed.`;

          // Update parcel status to "Removed"
          parcel.status = "Removed";
          await parcel.save();

          const notificationResident = {
            userId: resident._id,
            title: "Parcel Removed",
            message: messageResident,
            createdAt: new Date(),
            isRead: false,
          };
          await Notification.create(notificationResident);
          emitNotification("receiveNotification", notificationResident);
          await sendParcelEmail(
            residentEmail,
            "Parcel Removed",
            messageResident,
            parcel.qr?.imgDataUrl
          );

          const staffUsers = await User.find({
            role: "Staff",
            staffType: "Security",
          }).lean();
          for (const staff of staffUsers) {
            const notificationStaff = {
              userId: staff._id,
              title: "Parcel Removal Required",
              message: messageStaff,
              createdAt: new Date(),
              isRead: false,
            };
            await Notification.create(notificationStaff);
            emitNotification("receiveNotification", notificationStaff);
          }

          await ParcelNotificationLog.create({
            parcelId: parcel.parcelId,
            type: "14day",
          });
        }
      }
    }

    console.log("Parcel reminder job completed.");
  } catch (err) {
    console.error("Error in sendParcelReminders:", err);
  }
};

export const initializeParcelCronJobs = () => {
  cron.schedule("0 8 * * *", () => {
    console.log("Running parcel reminder cron job...");
    sendParcelReminders();
  });

  console.log("Parcel reminder cron jobs initialized.");
};
