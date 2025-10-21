import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Bell } from "lucide-react";
import axiosInstance from "../lib/axios";
import { useAuth } from "../context/vd_AuthContext";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get(`/notifications/${user._id}`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    const socket = io("http://localhost:5001");

    socket.on("receiveNotification", (data) => {
      if (data.userId === user._id) {
        setNotifications((prev) => [data, ...prev]);
      }
    });

    return () => socket.disconnect();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/mark-read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Side - Notifications List */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedNotification?._id === notification._id
                    ? "bg-blue-50 border-l-4 border-l-blue-500"
                    : notification.isRead
                    ? "bg-white hover:bg-gray-50"
                    : "bg-blue-50 hover:bg-blue-100"
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                    {notification.title}
                  </h3>
                  {!notification.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1"></span>
                  )}
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(notification.createdAt).toLocaleDateString()} at{" "}
                  {new Date(notification.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Side - Full Notification Details */}
      <div className="w-2/3 flex flex-col bg-white">
        {selectedNotification ? (
          <>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedNotification.title}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date(selectedNotification.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {new Date(selectedNotification.createdAt).toLocaleTimeString()}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                  {selectedNotification.message}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Select a notification to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;