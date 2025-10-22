import cron from "node-cron";
import User from "../models/vd_user.js";
import Payment from "../models/sn_payment.js";
import Purchase from "../models/SDpurchase.js";
import Notification from "../models/vd_notification.js";
import { emitNotification } from "../utils/vd_emitNotification.js";

const getMonthRange = () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { startDate, endDate };
};

//Monthly rent added
export const sendMonthlyRentAddedNotifications = async () => {
  try {
    const residents = await User.find({ role: "Resident" }).lean();

    for (const resident of residents) {
      const purchase = await Purchase.findOne({ apartmentNo: resident.apartmentNo }).lean();
      if (!purchase) continue;

      const rentAmount = purchase.monthly_rent || 0;
      if (rentAmount <= 0) continue;

      const notification = {
        userId: resident._id,
        title: "Monthly Rent Added",
        message: `Your monthly rent of LKR ${rentAmount} for this month has been added. Please complete your payment.`,
        createdAt: new Date(),
        isRead: false,
      };

      await Notification.create(notification);
      emitNotification("receiveNotification", notification);
    }

    console.log("Monthly rent added notifications sent.");
  } catch (error) {
    console.error("Error in sendMonthlyRentAddedNotifications:", error);
  }
};

//Weekly unpaid reminders
export const sendUnpaidReminders = async () => {
  try {
    const { startDate, endDate } = getMonthRange();
    const residents = await User.find({ role: "Resident" }).lean();

    for (const resident of residents) {
      const payment = await Payment.findOne({
        residentId: resident._id,
        status: "Completed",
        paymentDate: { $gte: startDate, $lte: endDate },
      }).lean();

      if (payment) continue;

      const notification = {
        userId: resident._id, 
        title: "Pending Payment Reminder",
        message: `You still have unpaid rent for this month. Please make your payment as soon as possible.`,
        createdAt: new Date(),
        isRead: false,
      };

      await Notification.create(notification);
      emitNotification("receiveNotification", notification);
    }

    console.log("Weekly unpaid payment reminders sent.");
  } catch (error) {
    console.error("Error in sendUnpaidReminders:", error);
  }
};

//Schedule
export const initializeRentCronJobs = () => {
  cron.schedule("0 8 1 * *", () => {
    console.log("Running monthly rent added job...");
    sendMonthlyRentAddedNotifications(); });

  cron.schedule("0 8 */7 * *", () => {
    console.log("Running weekly unpaid reminder job...");
    sendUnpaidReminders();
  });

  console.log("Monthly reminder cron jobs initialized.");
};
