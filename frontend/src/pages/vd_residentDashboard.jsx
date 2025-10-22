import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import axios from "axios";

const ResidentDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    activeServices: 0,
    pendingDeliveries: 0,
    unpaidBills: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "booking", title: "Pool Booking", date: "2025-10-01", status: "Confirmed" },
    { id: 2, type: "service", title: "Maintenance Request", date: "2025-09-30", status: "In Progress" },
    { id: 3, type: "delivery", title: "Package Received", date: "2025-09-29", status: "Delivered" },
    { id: 4, type: "bill", title: "Monthly Rent", date: "2025-09-28", status: "Paid" }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, title: "Community Meeting", date: "2025-10-05", time: "6:00 PM" },
    { id: 2, title: "Pool Reservation", date: "2025-10-07", time: "3:00 PM" },
    { id: 3, title: "Maintenance Schedule", date: "2025-10-10", time: "10:00 AM" }
  ]);

  // Fetch dashboard 
  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/users/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard data. Please try again.');
      
      console.error("Error fetching dashboard stats:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  // Fetch announcements from backend
  const fetchAnnouncements = async () => {
    try {
      setLoadingAnnouncements(true);
      const res = await axios.get("http://localhost:5001/api/announcements/recive");
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  // Load all data on mount
  useEffect(() => {
    fetchDashboardStats();
    fetchAnnouncements();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case "booking":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          {
            title: "Total Feedbacks",
            value: stats.totalFeedbacks,
            color: "blue",
            icon: (
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            ),
          },
          {
            title: "Active Services",
            value: stats.activeServices,
            color: "green",
          },
          {
            title: "Pending Deliveries",
            value: stats.pendingDeliveries,
            color: "purple",
          },
          {
            title: "Unpaid Bills",
            value: stats.unpaidBills,
            color: "red",
          },
        ].map((item, i) => (
          <div
            key={i}
            className={`bg-white p-6 rounded-xl shadow-lg border-l-4 border-${item.color}-500`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{item.title}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    item.value
                  )}
                </h3>
              </div>
              <div className={`bg-${item.color}-100 p-3 rounded-full`}>
                {item.icon || (
                  <svg
                    className={`w-8 h-8 text-${item.color}-500`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-gray-800">Announcements</h2>
  </div>

  {loadingAnnouncements ? (
    <p className="text-gray-500">Loading announcements...</p>
  ) : announcements.length === 0 ? (
    <p className="text-gray-500">No announcements available.</p>
  ) : (
    <div className="max-h-64 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100">
      {announcements.map((a) => (
        <div
          key={a._id}
          className="flex items-start p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 hover:bg-blue-100 transition"
        >
          {/* Left side: Date */}
          <div className="w-24 flex-shrink-0 text-center border-r border-blue-900 pr-4">
            <p className="text-sm font-semibold text-blue-700">
              {new Date(a.date || a.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Right side: Content */}
          <div className="flex-1 pl-4">
            <h3 className="font-semibold text-gray-800">{a.title}</h3>
            <p className="text-gray-700 mt-1">{a.message}</p>
            <p className="text-xs text-gray-500 mt-2">{a.date}</p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


      {/* Quick Actions */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex flex-col items-center gap-2 text-blue-600">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span className="font-medium">New Booking</span>
          </button>

          <button
            onClick={() => navigate("/add-service")}
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition flex flex-col items-center gap-2 text-green-600"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
              ></path>
            </svg>
            <span className="font-medium">Service Request</span>
          </button>

          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition flex flex-col items-center gap-2 text-purple-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span className="font-medium">Messages</span>
          </button>

          <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition flex flex-col items-center gap-2 text-orange-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span className="font-medium">Pay Bills</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;
