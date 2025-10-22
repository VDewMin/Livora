import React, { useEffect, useState } from "react";
import { Search, Bell, Mail } from "lucide-react";
import { useAuth } from "../context/vd_AuthContext";
import axiosInstance from "../lib/axios";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileHeader = () => {
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMailDropdown, setShowMailDropdown] = useState(false);

  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/deliveries": "Deliveries",
    "/admin/admin-view": "Services",
    "/admin/booking": "Booking",
    "/admin/billing": "Finance",
    "/admin/stafflist": "Employees",
    "/admin/residentlist": "Residents",
    "/admin/send-announcements": "Announcements",
    "/admin/apartments": "Apartments",
    "/admin/feedback": "Feedback",

    "/resident/dashboard": "Dashboard",
    "/resident/user-view": "Services",
    "/resident/booking": "Booking",
    "/resident/billing": "Billing",
    "/resident/feedback": "Feedback",

    "/securityDashboard": "Dashboard",
    "/security/deliveries": "Deliveries",
    "/viewParcels": "Parcel Entries",
    "/scanner": "QR Verification",
    "/addParcel": "Add Parcel",

    [`/profile/${user?._id}`]: "Account Information",
    [`/change-password/${user?._id}`]: "Change Password",
    [`/notifications/${user?._id}`]: "Notification Settings",
    [`/security-privacy/${user?._id}`]: "Security & Privacy",
  };

  const normalizedPath = location.pathname.replace(/\/$/, "");
  let currentTitle = pageTitles[normalizedPath];
  if (!currentTitle && normalizedPath.startsWith("/resident/dashboard/")) currentTitle = "Dashboard";
  if (!currentTitle) currentTitle = "Account Information";

  // 🔔 Fetch Notifications
  const fetchNotifications = async () => {
    if (!user?._id) return;
    try {
      const res = await axiosInstance.get(`/notifications/${user._id}/sidebar`);
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  // 📧 Fetch Announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await axiosInstance.get(`/announcements/recive`);
      setAnnouncements(res.data);
      setUnreadAnnouncements(res.data.filter((a) => !a.isRead).length);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchAnnouncements();
  }, [user?._id]);

  // 🔔 Notification Handlers
  const handleBellClick = async () => {
    setShowDropdown(!showDropdown);
    setShowMailDropdown(false);
    if (!showDropdown) await fetchNotifications();
  };

  const handleMarkAsRead = async () => {
    if (!user?._id) return;
    try {
      await axiosInstance.put(`/notifications/user/${user._id}/mark-read`);
      await fetchNotifications();
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await axiosInstance.patch(`/notifications/${notificationId}/mark-read`);
      await fetchNotifications();
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
    setShowDropdown(false);
    navigate(`/notifications/${user._id}`, { state: { notificationId } });
  };

  // 📧 Mail (Announcements) Handlers
  const handleMailClick = async () => {
    setShowMailDropdown(!showMailDropdown);
    setShowDropdown(false);
    if (!showMailDropdown) await fetchAnnouncements();
  };

  const handleMarkAnnouncementsRead = async () => {
    try {
      await axiosInstance.patch(`/announcements/mark-read`);
      await fetchAnnouncements();
      setUnreadAnnouncements((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to mark announcements as read:", err);
    }
  };

  const handleSeeMoreAnnouncements = () => {
    setShowMailDropdown(false);
    navigate("/resident/dashboard/userId");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 relative z-30">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-900">{currentTitle}</h1>

        {/* Right Side */}
        <div className="flex items-center space-x-4 relative">

          {/* 🔍 Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 📧 Mail Icon (Announcements) */}
          <div className="relative">
            <button
              className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
              onClick={handleMailClick}
            >
              <Mail className="h-5 w-5" />
              {unreadAnnouncements > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full min-w-[18px] text-center">
                  {unreadAnnouncements > 5 ? "5+" : unreadAnnouncements}
                </div>
              )}
            </button>

            {showMailDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 max-h-96 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-2 font-bold border-b flex justify-between items-center sticky top-0 bg-white">
                  <span>Announcements</span>
                  <button
                    onClick={handleMarkAnnouncementsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-normal"
                  >
                    Mark all as read
                  </button>
                </div>

                {/* Announcements List */}
                <div className="flex-1 overflow-y-auto">
                  {announcements.length === 0 ? (
                    <p className="p-2 text-gray-500 text-sm">No announcements</p>
                  ) : (
                    announcements.map((a) => (
                      <div
                        key={a._id}
                        className={`p-2 border-b hover:bg-gray-50 ${
                          !a.isRead ? "bg-blue-50" : "bg-white"
                        }`}
                      >
                        <p className="font-semibold break-words">{a.title}</p>
                        <p className="text-sm break-words whitespace-pre-line">
                          {a.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="p-2 border-t sticky bottom-0 bg-white">
                  <button
                    onClick={handleSeeMoreAnnouncements}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    See more
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 🔔 Notification Bell */}
          <div className="relative">
            <button
              className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
              onClick={handleBellClick}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 rounded-full min-w-[18px] text-center">
                  {unreadCount > 5 ? "5+" : unreadCount}
                </div>
              )}
            </button>
            {/* Notification Dropdown (unchanged) */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto flex flex-col">
                <div className="p-2 font-bold border-b flex justify-between items-center sticky top-0 bg-white">
                  <span>Notifications</span>
                  <button
                    onClick={handleMarkAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-normal"
                  >
                    Mark as read
                  </button>
                </div>

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

                <div className="p-2 border-t sticky bottom-0 bg-white">
                  <button
                    onClick={() => navigate(`/notifications/${user._id}`)}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    See more
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 👤 User Profile */}
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
                className="h-8 w-8 rounded-full object-cover"
                src={`${axiosInstance.defaults.baseURL}/users/${user.userId}/profile-picture?v=${user?.avatarVersion || Date.now()}`}
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
