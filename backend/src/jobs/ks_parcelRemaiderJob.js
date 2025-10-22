import cron from "node-cron";
import Parcel from "../models/ks_Parcel.js";
import User from "../models/vd_user.js";
import Notification from "../models/vd_notification.js";
import { emitNotification } from "../utils/vd_emitNotification.js";
import { transporter } from "../config/mail.js"; 
import mongoose from "mongoose";


cron.schedule("0 8 * * *", async () => {
  console.log("parcelReminderJob running - checking for 4-day reminders...");

  const now = new Date();

  try {
    const parcels = await Parcel.find({ status: "Pending" });

    for (const parcel of parcels) {
      const created = parcel.createdAt ? new Date(parcel.createdAt) : null;
      if (!created) continue;

      const msElapsed = now - created;
      const daysElapsed = Math.floor(msElapsed / (1000 * 60 * 60 * 24)); 

      if (daysElapsed >= 4) {
        let resident = null;
        if (parcel.residentId && mongoose.isValidObjectId(parcel.residentId)) {
          resident = await User.findById(parcel.residentId).lean();
        }
        if (!resident && parcel.apartmentNo) {
          resident = await User.findOne({ apartmentNo: parcel.apartmentNo }).lean();
        }
        if (!resident || !resident.email) {
          console.warn(`No resident/email found for parcel ${parcel._id} - skipping reminder.`);
          continue;
        }

        const existingReminder = await Notification.findOne({
          userId: resident._id.toString(),
          title: "Parcel Reminder",
          "meta.parcelId": parcel._id.toString()
        }).lean();

        if (existingReminder) {
          continue;
        }

        const mailOptions = {
          from: `"LIVORA" <${process.env.EMAIL_USER}>`,
          to: resident.email,
          subject: "Reminder: Your parcel is still in the lobby",
          html: `
            <p>Dear ${resident.name || "Resident"},</p>
            <p>This is a friendly reminder that a parcel addressed to you (received on ${created.toDateString()}) is still in the lobby.</p>
            <p>Please collect it at your earliest convenience. The QR code you received will still be valid until its expiry.</p>
            <p>Thank you,<br/>LIVORA Management</p>
          `
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Reminder email sent to ${resident.email} for parcel ${parcel._id}`);
        } catch (emailErr) {
          console.error(`Failed to send reminder email for parcel ${parcel._id}:`, emailErr);
        }

        const notification = {
          userId: resident._id.toString(),
          title: "Parcel Reminder",
          message: "Your parcel is still awaiting collection in the lobby.",
          createdAt: new Date(),
          isRead: false,
          meta: { parcelId: parcel._id.toString() } 
        };

        try {
          await Notification.create(notification);
          emitNotification(notification);
          console.log(`In-app reminder created for user ${resident._id} parcel ${parcel._id}`);
        } catch (notifErr) {
          console.error(`Failed to create/emit notification for parcel ${parcel._id}:`, notifErr);
        }
      } 

      if (daysElapsed === 10) {
        const existingReminder = await Notification.findOne({
          userId: resident._id.toString(),
          title: "Parcel Final Warning (10 Days)",
          "meta.parcelId": parcel._id.toString(),
        }).lean();

        if (!existingReminder) {
          await transporter.sendMail({
            from: `"LIVORA" <${process.env.EMAIL_USER}>`,
            to: resident.email,
            subject: "Final Notice: Parcel will be removed soon",
            html: `
              <p>Dear ${resident.name || "Resident"},</p>
              <p>Your parcel (received on ${created.toDateString()}) has been in the lobby for 10 days.</p>
              <p>Please collect it within the next 4 days. After 14 days, it will be removed from storage.</p>
              <p>Thank you,<br/>LIVORA Management</p>
            `,
          });

          const notification = {
            userId: resident._id.toString(),
            title: "Parcel Final Warning (10 Days)",
            message: "Your parcel will be removed in 4 days if not collected.",
            createdAt: new Date(),
            isRead: false,
            meta: { parcelId: parcel._id.toString() },
          };

          await Notification.create(notification);
          emitNotification(notification);
          console.log(`⚠️ 10-day final warning sent to ${resident.email}`);
        }
      }

      // =============== 14-DAY SECURITY ALERT ===============
    if (daysElapsed === 14) {
    try {
        // Find all security/staff users
        const staffUsers = await User.find({ role: { $in: ["Security", "Staff"] } }).lean();
        if (!staffUsers || staffUsers.length === 0) {
        console.warn("No security/staff users found for 14-day alerts.");
        continue;
        }

        // For each staff user, create a notification if one doesn't already exist
        for (const staff of staffUsers) {
        // Prevent duplicate alerts for same parcel & staff
        const existing = await Notification.findOne({
            userId: staff._id.toString(),
            title: "Parcel Removal Alert",
            "meta.parcelId": parcel.parcelId // use parcel.parcelId so it matches your schema
        }).lean();

        if (existing) {
            // already created for this staff -> skip
            continue;
        }

        const notif = {
            userId: staff._id.toString(),
            title: "Parcel Removal Alert",
            message: `Parcel (ID: ${parcel.parcelId}) at location ${parcel.locId} has been pending for 14 days. Please remove it from storage.`,
            createdAt: new Date(),
            isRead: false,
            meta: { parcelId: parcel.parcelId, locId: parcel.locId }
        };

        // Save to DB
        await Notification.create(notif);

        // Emit real-time — emitNotification should send to the specific user (implementation dependent)
        // If your emitNotification accepts the notification object and emits to the userId inside it, this will send to an online user.
        // If emitNotification broadcasts, you may want a variant that targets a socket id or userId room.
        try {
            emitNotification(notif);
        } catch (emitErr) {
            // Non-fatal: notification is still saved, so staff will see it on login
            console.warn("emitNotification failed (but notification saved):", emitErr);
        }
        } // end for each staff

        console.log(`🚨 Created removal alerts for parcel ${parcel.parcelId}`);
    } catch (err) {
        console.error("Error creating 14-day security alerts:", err);
    }
    }

    } 
  } catch (err) {
    console.error("parcelReminderJob error:", err);
  }
});
