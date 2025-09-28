// src/pages/vd_dashboardLayout.jsx
import Sidebar from "../components/vd_sidebar";
import ProfileHeader from "../components/vd_profileHeader";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const DashboardLayout = () => {
  const [activeItem, setActiveItem] = useState("account-information");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex -m-4">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0"
        } flex-shrink-0`}
      >
        <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <ProfileHeader />
        <div className="flex-1 p-6 bg-gray-50">
          {/* ✅ This is where child pages render */}
          <Outlet />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
