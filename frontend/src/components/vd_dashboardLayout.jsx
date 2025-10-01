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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0"
        } flex-shrink-0 fixed left-0 top-0 h-screen z-30`}
      >
        <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: isSidebarOpen ? '256px' : '0px' }}>
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 z-20" style={{ left: isSidebarOpen ? "256px" : "0px" }}>
          <ProfileHeader />
        </div>
        
        {/* Scrollable Content */}
        <div 
          className="flex-1 bg-gray-50 overflow-y-auto"
          style={{ 
            marginTop: '80px' // Adjust based on header height
          }}
        >
          <div className="p-6">
            <Outlet />
          </div>
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
