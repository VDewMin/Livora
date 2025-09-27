// src/pages/KsSecurityDashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/vd_sidebar.jsx";
import TotalParcelsCard from "../components/Ks_TotalParcelsCard";
import PendingParcelsCard from "../components/Ks_PendingParcelsCard";
import CollectedParcelsCard from "../components/Ks_CollectedParcelsCard";
import RemovedParcelsCard from "../components/Ks_RemovedParcelsCard";
import { Shield, Package, Lock } from "lucide-react";
import axiosInstance from "../lib/axios.js";

const KsSecurityDashboard = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    collected: 0,
    removed: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/parcels/parcelCounts");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);

    switch (itemId) {
      case "parcel-logs": navigate("/viewParcels"); break;
      case "dashboard": navigate("/secDashboard"); break;
      case "parcel-pickup-verification": navigate(""); break;
      case "account-information": navigate("/profile/:id"); break;
      default: break;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />

      {/* Main Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Header Section Card */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Security Parcel Management
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Secure package handling & monitoring
                  </p>
                </div>
              </div>
              
              {/* Status Indicators */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-green-700">System Active</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                  <Lock className="h-3 w-3 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <TotalParcelsCard count={stats.total}/>
          <PendingParcelsCard count={stats.pending}/>
          <CollectedParcelsCard count={stats.collected}/>
          <RemovedParcelsCard count={stats.removed}/>
        </div>
      </div>
    </div>
  );
};

export default KsSecurityDashboard;