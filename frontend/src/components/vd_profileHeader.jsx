import { Search, Bell, Mail } from 'lucide-react';
import { useAuth } from '../context/vd_AuthContext';
import axiosInstance from '../lib/axios';
import { useLocation } from "react-router-dom";

const ProfileHeader = () => {

  const { user, logout} = useAuth();
  const location = useLocation();

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/deliveries": "Deliveries",
    "/admin/admin-view": "Services",
    "/admin/booking": "Booking",
    "/admin/billing": "Billing",
    "/admin/stafflist": "Manage Staff",

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

  // Use pathname to select header text, fallback if not matched
  const currentTitle = pageTitles[location.pathname] || "Account Information";
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">{currentTitle}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
            <Mail className="h-5 w-5" />
          </button>
          <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
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
                key={user?.updatedAt}
                className="h-8 w-8 rounded-full object-cover"
                src={`${axiosInstance.defaults.baseURL}/users/${user.userId}/profile-picture?updated=${user.updatedAt || Date.now()}`}
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