import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axiosInstance from "../lib/axios.js";
import Sidebar from "../components/vd_sidebar.jsx";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const KsAdminDeliveries = () => {
  const [parcelsOverTime, setParcelsOverTime] = useState([]);
  const [statusDist, setStatusDist] = useState([]);
  const [parcelsPerApartment, setParcelsPerApartment] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Parcels Over Time
        const overTimeRes = await axiosInstance.get("/parcels/parcelsOverTime");
        setParcelsOverTime(
          overTimeRes.data.map((d) => ({
            day: new Date(d.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            count: d.count,
          }))
        );

        // 2. Status Distribution
        const statusRes = await axiosInstance.get(
          "/parcels/statusDistribution"
        );
        const s = statusRes.data;
        setStatusDist([
          { name: "Pending", value: s.pending },
          { name: "Collected", value: s.collected },
          { name: "Removed", value: s.removed },
        ]);

        // 3. Parcels Per Apartment
        const aptRes = await axiosInstance.get("/parcels/parcelsPerApartment");
        setParcelsPerApartment(
          aptRes.data.map((d) => ({
            apartment: d.apartment,
            count: d.count,
          }))
        );
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto h-screen">
        <div className="p-5">
          {/* Header Card */}
          <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-100">
            <h1 className="text-2xl font-bold mb-2 text-gray-800">
              📦 Deliveries Analytics
            </h1>
            <p className="text-gray-600 text-base">
              Monitor and track your delivery performance
            </p>
          </div>

          {/* Grid Layout - 2 Charts Per Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Parcels Over Time */}
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  Parcels Over Time
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Daily parcel delivery trends
                </p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={parcelsOverTime}>
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ fill: "#8884d8", r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Status Distribution */}
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  Status Distribution
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Current parcel status breakdown
                </p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusDist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {statusDist.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Parcels Per Apartment */}
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  Parcels Per Apartment
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Distribution across apartments
                </p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={parcelsPerApartment}>
                  <XAxis dataKey="apartment" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="count" fill="#82ca9d" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KsAdminDeliveries;
