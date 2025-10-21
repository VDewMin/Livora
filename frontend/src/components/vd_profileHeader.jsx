import React, { useEffect, useState, useRef, useCallback } from "react";
import { Search, Bell, Mail, User, MessageSquare, Calendar, CreditCard, Package, Shirt } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);


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

  // Debounced search function
  const debouncedSearch = useCallback(async (query) => {
    if (!query.trim() || query.trim().length < 2 || !user?._id) {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await axiosInstance.get(`/search/${user._id}?q=${encodeURIComponent(query)}`);

      // Flatten grouped results into one array
      const flattened = Object.entries(res.data)
        .flatMap(([category, items]) =>
          items.map((item) => ({
            ...item,
            category, // remember where it came from
          }))
        );

      setSearchResults(flattened);
      setShowResults(flattened.length > 0);
      setSelectedResultIndex(-1);

    } catch (err) {
      console.error("Search failed:", err);
      setSearchError("Search failed. Please try again.");
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  }, [user?._id]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      debouncedSearch(value);
    }, 300); // 300ms delay
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Get icon for search result category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'users': return <User className="h-4 w-4" />;
      case 'feedback': return <MessageSquare className="h-4 w-4" />;
      case 'notifications': return <Bell className="h-4 w-4" />;
      case 'announcements': return <MessageSquare className="h-4 w-4" />;
      case 'services': return <Package className="h-4 w-4" />;
      case 'bookings': return <Calendar className="h-4 w-4" />;
      case 'billing': return <CreditCard className="h-4 w-4" />;
      case 'deliveries': return <Package className="h-4 w-4" />;
      case 'laundryRequests': return <Shirt className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  // Get navigation path for search result
  const getNavigationPath = (item) => {
    switch (item.category) {
      case 'users': return '/admin/residentlist';
      case 'feedback': 
        // Navigate to feedback page based on user role
        if (user?.role === 'Admin') return '/admin/feedback';
        return '/resident/feedback';
      case 'notifications': return `/notifications/${user._id}`;
      case 'announcements': return '/admin/announcements';
      case 'services': return '/resident/user-view';
      case 'bookings': return '/resident/booking';
      case 'billing': return '/resident/billing';
      case 'deliveries': 
        // Navigate to deliveries page based on user role
        if (user?.role === 'Admin') return '/admin/deliveries';
        if (user?.role === 'Staff' && user?.staffType === 'Security') return '/security/deliveries';
        return '/resident/deliveries';
      case 'laundryRequests': return '/laundry';
      default: return '/';
    }
  };

  // Get display title for search result
  const getDisplayTitle = (item) => {
    switch (item.category) {
      case 'users': return `${item.firstName} ${item.lastName}`;
      case 'feedback': return item.message?.substring(0, 50) + (item.message?.length > 50 ? '...' : '');
      case 'notifications': return item.title;
      case 'announcements': return item.title;
      case 'services': return item.serviceType;
      case 'bookings': return item.name || item.purpose;
      case 'billing': return item.paymentType || item.description;
      case 'deliveries': return item.parcelId || item.recipientName;
      case 'laundryRequests': return item.resident_name;
      default: return 'Unknown';
    }
  };

  // Handle search result click
  const handleResultClick = (item) => {
    setShowResults(false);
    setSearchQuery("");
    setSelectedResultIndex(-1);
    navigate(getNavigationPath(item));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showResults || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
          handleResultClick(searchResults[selectedResultIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSearchQuery("");
        setSelectedResultIndex(-1);
        break;
    }
  };

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setSelectedResultIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


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
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    Searching...
                  </div>
                ) : searchError ? (
                  <div className="p-4 text-center text-red-500">
                    {searchError}
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="p-2 text-xs text-gray-500 border-b bg-gray-50">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </div>
                    {searchResults.map((item, index) => (
                      <div
                        key={item._id}
                        className={`p-3 cursor-pointer border-b last:border-b-0 flex items-center space-x-3 ${
                          index === selectedResultIndex 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleResultClick(item)}
                      >
                        <div className="flex-shrink-0 text-gray-400">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {getDisplayTitle(item)}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {item.category.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                ) : searchQuery.trim().length >= 2 ? (
                  <div className="p-4 text-center text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                ) : null}
              </div>
            )}
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