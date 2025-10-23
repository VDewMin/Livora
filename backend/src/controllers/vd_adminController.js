import User from "../models/vd_user.js";
import Payment from "../models/sn_payment.js";
import ConventionHallBooking from "../models/SDConventionHallBooking.js";
import GKServiceRequest from "../models/GKServiceRequest.js";
import Purchase from "../models/SDpurchase.js";

// Get admin dashboard statistics
export const getAdminStats = async (req, res) => {
  try {
    // Get total counts
    const totalResidents = await User.countDocuments({ role: "Resident" });
    const totalStaff = await User.countDocuments({ role: "Staff" });
    const totalLivoraUsers = await User.countDocuments();
    
    
    const totalApartments = await Purchase.countDocuments();
    
    
    const activeBookings = await ConventionHallBooking.countDocuments({
      status: "accepted",
      date: { $gte: new Date() }
    });
    
    
    const pendingRequests = await GKServiceRequest.countDocuments({
      status: "Pending"
    });
  
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const monthlyPayments = await Payment.aggregate([
      {
        $match: {
          status: "Completed",
          paymentDate: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);
    
    const monthlyRevenue = monthlyPayments.length > 0 ? monthlyPayments[0].totalRevenue : 0;
    
    // Calculate revenue growth (compare with previous month)
    const prevMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const prevMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    
    const prevMonthPayments = await Payment.aggregate([
      {
        $match: {
          status: "Completed",
          paymentDate: {
            $gte: prevMonthStart,
            $lte: prevMonthEnd
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);
    
    const prevMonthRevenue = prevMonthPayments.length > 0 ? prevMonthPayments[0].totalRevenue : 0;
    const revenueGrowth = prevMonthRevenue > 0 ? 
      Math.round(((monthlyRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 * 10) / 10 : 0;
    
    res.status(200).json({
      totalResidents,
      totalStaff,
      totalApartments,
      totalLivoraUsers,
      activeBookings,
      pendingRequests,
      monthlyRevenue,
      revenueGrowth
    });
  } catch (error) {
    console.error("Error in getAdminStats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookingTrends = async (req, res) => {
  try {
    const bookingData = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
      
      const bookingCount = await ConventionHallBooking.countDocuments({
        date: {
          $gte: monthDate,
          $lt: nextMonthDate
        }
      });
      
      bookingData.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        bookings: bookingCount
      });
    }
    
    res.status(200).json(bookingData);
  } catch (error) {
    console.error("Error in getBookingTrends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRevenueData = async (req, res) => {
  try {
    const revenueData = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
      
      const monthlyRevenue = await Payment.aggregate([
        {
          $match: {
            status: "Completed",
            paymentDate: {
              $gte: monthDate,
              $lt: nextMonthDate
            }
          }
        },
        {
          $group: {
            _id: null,
            revenue: { $sum: "$totalAmount" }
          }
        }
      ]);
      
      revenueData.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        revenue: monthlyRevenue.length > 0 ? monthlyRevenue[0].revenue : 0
      });
    }
    
    res.status(200).json(revenueData);
  } catch (error) {
    console.error("Error in getRevenueData:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  service data for pie chart
export const getServiceDistribution = async (req, res) => {
  try {
    const serviceTypes = await GKServiceRequest.aggregate([
      {
        $group: {
          _id: "$serviceType",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: "$_id",
          value: "$count",
          _id: 0
        }
      }
    ]);
    
    // If no data, return default distribution
    if (serviceTypes.length === 0) {
      return res.status(200).json([
        { name: "Maintenance", value: 35 },
        { name: "Cleaning", value: 25 },
        { name: "Security", value: 20 },
        { name: "Deliveries", value: 15 },
        { name: "Others", value: 5 }
      ]);
    }
    
    res.status(200).json(serviceTypes);
  } catch (error) {
    console.error("Error in getServiceDistribution:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get recent activities across the system
export const getRecentActivities = async (req, res) => {
  try {
    const activities = [];
    const recentUsers = await User.find({ role: "Resident" })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("firstName lastName createdAt");
    
    recentUsers.forEach(user => {
      activities.push({
        id: `user_${user._id}`,
        user: `${user.firstName} ${user.lastName}`,
        action: "New resident registered",
        time: getTimeAgo(user.createdAt),
        type: "success"
      });
    });
    
    const recentServices = await GKServiceRequest.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('userId', 'firstName lastName');
    
    recentServices.forEach(service => {
      activities.push({
        id: `service_${service._id}`,
        user: service.userId ? `${service.userId.firstName} ${service.userId.lastName}` : "Unknown User",
        action: `${service.serviceType} request submitted`,
        time: getTimeAgo(service.createdAt),
        type: service.status === "Pending" ? "warning" : "info"
      });
    });
    
    const recentPayments = await Payment.find({ status: "Completed" })
      .sort({ paymentDate: -1 })
      .limit(2)
      .select("residentName paymentDate");
    
    recentPayments.forEach(payment => {
      activities.push({
        id: `payment_${payment._id}`,
        user: payment.residentName,
        action: "Payment completed",
        time: getTimeAgo(payment.paymentDate),
        type: "success"
      });
    });
    
    const recentBookings = await ConventionHallBooking.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("name status createdAt");
    
    recentBookings.forEach(booking => {
      const action = booking.status === "rejected" ? "Booking cancelled" : "Hall booking created";
      activities.push({
        id: `booking_${booking._id}`,
        user: booking.name,
        action: action,
        time: getTimeAgo(booking.createdAt),
        type: booking.status === "rejected" ? "error" : "info"
      });
    });
    
    
    activities.sort((a, b) => {
      
      const timeToMinutes = (timeStr) => {
        if (timeStr.includes('min')) return parseInt(timeStr);
        if (timeStr.includes('hour')) return parseInt(timeStr) * 60;
        if (timeStr.includes('day')) return parseInt(timeStr) * 1440;
        return 0;
      };
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });
    
    res.status(200).json(activities.slice(0, 5));
  } catch (error) {
    console.error("Error in getRecentActivities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
  
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} mins ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};
