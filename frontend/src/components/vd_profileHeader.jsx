import React, { useEffect, useState } from "react";
import { Search, Bell, Mail } from "lucide-react";
import { useAuth } from "../context/vd_AuthContext";
import axiosInstance from "../lib/axios";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileHeader = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/deliveries": "Deliveries",
    "/admin/admin-view": "Services",
    "/admin/booking": "Booking",
    "/admin/billing": "Finance",
    "/admin/stafflist": "Employees",
    "/admin/residentlist": "Residents",
    "/admin/apartments": "Apartments",
    "/admin/feedback": "Feedback",

    "/resident/dashboard": "Dashboard",
    "/resident/deliveries": "Deliveries",
    "/resident/user-view": "Services",
    "/resident/booking": "Booking",
    "/resident/billing": "Billing",
    "/resident/feedback": "Feedback",

    "/securityDashboard": "Dashboard",
    "/security/deliveries": "Deliveries",
    "/viewParcels": "Parcel Entries",
    "/scanner": "QR Verification",
    "/addParcel": "Add Parcel",

    // Settings
    [`/profile/${user?._id}`]: "Account Information",
    [`/change-password/${user?._id}`]: "Change Password",
    [`/notifications/${user?._id}`]: "Notification Settings",
    [`/security-privacy/${user?._id}`]: "Security & Privacy",
  };

  const normalizedPath = location.pathname.replace(/\/$/, "");
  let currentTitle = pageTitles[normalizedPath];

  if (!currentTitle && normalizedPath.startsWith("/resident/dashboard/")) {
    currentTitle = "Dashboard";
  }
  if (!currentTitle) {
    currentTitle = "Account Information";
  }

  const fetchNotifications = async () => {
    if (!user?._id) return;
    try {
      const res = await axiosInstance.get(`/notifications/${user._id}/sidebar`);
      setNotifications(res.data);

      const unread = res.data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?._id]);

  const handleBellClick = async () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      await fetchNotifications();
    }
  };

  const handleMarkAsRead = async () => {
    if (!user?._id) return;
    try {
      // Call API to mark all notifications as read
      await axiosInstance.put(`/notifications/user/${user._id}/mark-read`);

      // Refresh notifications
      await fetchNotifications();

      setUnreadCount(0);

    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const handleSeeMore = () => {
    setShowDropdown(false);
    navigate(`/notifications/${user._id}`);
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      // Mark individual notification as read
      await axiosInstance.patch(`/notifications/${notificationId}/mark-read`);
      // Refresh notifications
      await fetchNotifications();

      setUnreadCount((prev) => Math.max(prev - 1, 0));

    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
    setShowDropdown(false);
    navigate(`/notifications/${user._id}`, { state: { notificationId } });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 relative z-30">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">{currentTitle}</h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4 relative">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Mail Icon */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
            <Mail className="h-5 w-5" />
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
              onClick={handleBellClick}
            >
              <Bell className="h-5 w-5" />
              
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto flex flex-col">
                {/* Header with Mark as Read */}
                <div className="p-2 font-bold border-b flex justify-between items-center sticky top-0 bg-white">
                  <span>Notifications</span>
                  <button
                    onClick={handleMarkAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-normal"
                  >
                    Mark as read
                  </button>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-2 text-gray-500 text-sm">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`p-2 border-b hover:bg-gray-50 cursor-pointer ${
                          !n.isRead ? "bg-blue-50" : "bg-white"
                        }`}
                        onClick={() => handleNotificationClick(n._id)}
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-semibold flex-1">{n.title}</p>
                          {!n.isRead && (
                            <span className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5 ml-2"></span>
                          )}
                        </div>
                        <p className="text-sm">{n.message}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* See More Button */}
                <div className="p-2 border-t sticky bottom-0 bg-white">
                  <button
                    onClick={handleSeeMore}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    See more
                  </button>
                </div>
              </div>
            )}

            {/* Notification Count */}
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full min-w-[18px] text-center">
                {unreadCount > 5 ? "5+" : unreadCount}
              </div>
            )}

          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user ? `${user.firstName} ${user.lastName}` : "Guest"}
              </div>
              <div className="text-xs text-gray-500">
                {user ? user.email : "Not logged in"}
              </div>
            </div>
            {user?.profilePicture ? (
              <img
                key={user?.avatarVersion || user?.updatedAt}
                className="h-8 w-8 rounded-full object-cover"
                src={`${axiosInstance.defaults.baseURL}/users/${user.userId}/profile-picture?v=${user?.avatarVersion || user?.updatedAt || Date.now()}`}
                alt="Profile"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                {user?.firstName?.[0]}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;