import React, { useEffect, useState } from "react";
import { Search, Bell, Mail } from "lucide-react";
import { useAuth } from "../context/vd_AuthContext";
import axiosInstance from "../lib/axios";
import { useLocation } from "react-router-dom";

const ProfileHeader = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { user } = useAuth();
  const location = useLocation();

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/deliveries": "Deliveries",
    "/admin/admin-view": "Services",
    "/admin/booking": "Booking",
    "/admin/billing": "Billing",
    "/admin/stafflist": "Employees",
    "/admin/residentlist": "Residents",
    "/admin/apartments": "Apartments",

    "/resident/dashboard": "Dashboard",
    "/resident/deliveries": "Deliveries",
    "/resident/user-view": "Services",
    "/resident/booking": "Booking",
    "/resident/billing": "Billing",

    "/securityDashboard": "Dashboard",
    "/security/deliveries": "Deliveries",
    "/viewParcels": "Parcel Entries",
    "/scanner": "QR Verification",
    "/addParcel": "Add Parcel",

    // Settings
    [`/profile/${user?._id}`]: "Account Information",
    [`/change-password/${user?._id}`]: "Change Password",
    [`/notifications/${user?._id}`]: "Notification Settings",
    [`/personalization/${user?._id}`]: "Personalization",
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

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axiosInstance.get("/api/announcements");
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    }
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
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <Bell className="h-5 w-5" />
              {announcements.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-2 font-bold border-b">Announcements</div>
                {announcements.length === 0 ? (
                  <p className="p-2 text-gray-500 text-sm">No announcements</p>
                ) : (
                  announcements.map((a) => (
                    <div key={a._id} className="p-2 border-b hover:bg-gray-50">
                      <p className="font-semibold">{a.title}</p>
                      <p className="text-sm">{a.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(a.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Notification Count */}
            {announcements.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
                {announcements.length}
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
