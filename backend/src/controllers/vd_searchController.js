import User from "../models/vd_user.js";
import Feedback from "../models/vd_feedback.js";
import Notification from "../models/vd_notification.js";
import Announcement from "../models/GKAnnouncements.js";
import Payment from "../models/sn_payment.js";
import Parcel from "../models/ks_Parcel.js";
import ConventionHallBooking from "../models/SDConventionHallBooking.js";
import GKServiceRequest from "../models/GKServiceRequest.js";
import LaundryRequest from "../models/SDLaundryRequest.js";

export const globalSearch = async (req, res) => {
  try {
    console.log("✅ Global search hit with:", req.params, req.query);

    const { userId } = req.params;
    const { q } = req.query;

    if (!userId || !q) {
      return res.status(400).json({ message: "User ID and search query required" });
    }

    // Find user to identify their role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let results = {};

    switch (user.role) {
      // 🔹 ADMIN SEARCH: Users, Feedback, Notifications, Announcements
      case "Admin":
        // Check if query looks like an ObjectId (24 hex characters)
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(q);
        
        results = {
          users: await User.find({
            $or: [
              { firstName: { $regex: q, $options: "i" } },
              { lastName: { $regex: q, $options: "i" } },
              { email: { $regex: q, $options: "i" } },
              { phone: { $regex: q, $options: "i" } },
              { apartmentNumber: { $regex: q, $options: "i" } },
              { role: { $regex: q, $options: "i" } },
              ...(isObjectId ? [{ _id: q }] : []),
            ],
          }).limit(5),

          feedback: await Feedback.find({
            $or: [
              { message: { $regex: q, $options: "i" } },
              { feedbackType: { $regex: q, $options: "i" } },
              { feedbackAbout: { $regex: q, $options: "i" } },
              { status: { $regex: q, $options: "i" } },
              { feedbackId: { $regex: q, $options: "i" } }, // Human-readable ID: FB001, FB002, etc.
              ...(isObjectId ? [{ _id: q }] : []),
            ],
          }).limit(5),

          notifications: await Notification.find({
            $or: [
              { title: { $regex: q, $options: "i" } },
              { message: { $regex: q, $options: "i" } },
              { type: { $regex: q, $options: "i" } },
              { status: { $regex: q, $options: "i" } },
              ...(isObjectId ? [{ _id: q }] : []),
            ],
          }).limit(5),

          announcements: await Announcement.find({
            $or: [
              { title: { $regex: q, $options: "i" } },
              { message: { $regex: q, $options: "i" } },
              { category: { $regex: q, $options: "i" } },
              { status: { $regex: q, $options: "i" } },
              ...(isObjectId ? [{ _id: q }] : []),
            ],
          }).limit(5),
        };
        break;

      // 🔹 RESIDENT SEARCH: Services, Billing, Booking, Feedback, Notifications
      case "Resident":
        // Check if query looks like an ObjectId (24 hex characters)
        const isObjectIdResident = /^[0-9a-fA-F]{24}$/.test(q);
        
        results = {
          services: await GKServiceRequest.find({
            $or: [
              { serviceType: { $regex: q, $options: "i" } },
              { description: { $regex: q, $options: "i" } },
              { aptNo: { $regex: q, $options: "i" } },
              { status: { $regex: q, $options: "i" } },
              { serviceId: { $regex: q, $options: "i" } }, // Human-readable ID: S001, S002, etc.
              ...(isObjectIdResident ? [{ _id: q }] : []),
            ],
          }).limit(5),

          bookings: await ConventionHallBooking.find({
            $or: [
              { name: { $regex: q, $options: "i" } },
              { apartment_room_number: { $regex: q, $options: "i" } },
              { purpose: { $regex: q, $options: "i" } },
              { status: { $regex: q, $options: "i" } },
              ...(isObjectIdResident ? [{ _id: q }] : []),
            ],
          }).limit(5),

          billing: await Payment.find({
            $or: [
              { paymentType: { $regex: q, $options: "i" } },
              { description: { $regex: q, $options: "i" } },
              { paymentId: { $regex: q, $options: "i" } }, // Human-readable payment ID
              { transactionId: { $regex: q, $options: "i" } },
              { status: { $regex: q, $options: "i" } },
              ...(isObjectIdResident ? [{ _id: q }] : []),
            ],
          }).limit(5),

          feedback: await Feedback.find({
            userId,
            $or: [
              { message: { $regex: q, $options: "i" } },
              { feedbackAbout: { $regex: q, $options: "i" } },
              { feedbackType: { $regex: q, $options: "i" } },
              { status: { $regex: q, $options: "i" } },
              { feedbackId: { $regex: q, $options: "i" } }, // Human-readable ID: FB001, FB002, etc.
              ...(isObjectIdResident ? [{ _id: q }] : []),
            ],
          }).limit(5),

          notifications: await Notification.find({
            userId,
            $or: [
              { title: { $regex: q, $options: "i" } },
              { message: { $regex: q, $options: "i" } },
              { type: { $regex: q, $options: "i" } },
              { status: { $regex: q, $options: "i" } },
              ...(isObjectIdResident ? [{ _id: q }] : []),
            ],
          }).limit(5),
        };
        break;

      // 🔹 SECURITY SEARCH: Deliveries / Parcels, Notifications
      case "Staff":
        // Check if query looks like an ObjectId (24 hex characters)
        const isObjectIdStaff = /^[0-9a-fA-F]{24}$/.test(q);
        
        if (user.staffType === "Security") {
          results = {
            deliveries: await Parcel.find({
              $or: [
                { parcelId: { $regex: q, $options: "i" } }, // Human-readable ID: P001, P002, etc.
                { recipientName: { $regex: q, $options: "i" } },
                { apartmentNo: { $regex: q, $options: "i" } },
                { status: { $regex: q, $options: "i" } },
                { locId: { $regex: q, $options: "i" } }, // Location ID: L1, L2, etc.
                ...(isObjectIdStaff ? [{ _id: q }] : []),
              ],
            }).limit(5),

            notifications: await Notification.find({
              userId,
              $or: [
                { title: { $regex: q, $options: "i" } },
                { message: { $regex: q, $options: "i" } },
                { type: { $regex: q, $options: "i" } },
                { status: { $regex: q, $options: "i" } },
                ...(isObjectIdStaff ? [{ _id: q }] : []),
              ],
            }).limit(5),
          };
        }

        // 🔹 LAUNDRY SEARCH: Laundry Requests, Notifications
        else if (user.staffType === "Laundry") {
          results = {
            laundryRequests: await LaundryRequest.find({
              $or: [
                { resident_name: { $regex: q, $options: "i" } },
                { status: { $regex: q, $options: "i" } },
                { service_type: { $regex: q, $options: "i" } },
                { resident_id: { $regex: q, $options: "i" } },
                { schedule_id: { $regex: q, $options: "i" } }, // Human-readable ID: LAUN...
                ...(isObjectIdStaff ? [{ _id: q }] : []),
              ],
            }).limit(5),

            notifications: await Notification.find({
              userId,
              $or: [
                { title: { $regex: q, $options: "i" } },
                { message: { $regex: q, $options: "i" } },
                { type: { $regex: q, $options: "i" } },
                { status: { $regex: q, $options: "i" } },
                ...(isObjectIdStaff ? [{ _id: q }] : []),
              ],
            }).limit(5),
          };
        }
        break;

      default:
        results = {};
        break;
    }

    const totalResults = Object.values(results).flat().length;
    console.log("🟩 Returning search results:", totalResults);
    
    // Debug: Log each category's result count
    Object.entries(results).forEach(([category, items]) => {
      if (items.length > 0) {
        console.log(`  📋 ${category}: ${items.length} results`);
      }
    });
    
    res.json(results);
  } catch (err) {
    console.error("❌ Error in global search:", err);
    res.status(500).json({ error: err.message });
  }
};
