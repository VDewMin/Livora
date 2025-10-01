import React, { useState, useEffect } from "react";
import api from "../lib/axios.js";
import { Plus, Edit, Trash, Search, Filter, Download } from "lucide-react";
import { formatDate } from "../lib/utils.js";
import { Link } from "react-router";
import toast from "react-hot-toast";
import Sidebar from "../components/vd_sidebar.jsx";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";


const KsViewParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState("parcel-logs");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const res = await api.get("/parcels");
        setParcels(res.data);
      } catch (error) {
        console.log("error fetching parcels");
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this parcel?")) return;

    try {
      await api.delete(`/parcels/${id}`);
      setParcels((prev) => prev.filter((p) => p._id !== id));
      toast.success("Parcel deleted successfuly!");
    } catch (error) {
      console.log("error in handleDelete", error);
      toast.error("Failed to delete Parcel");
    }
  };

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);

    switch (itemId) {
    case "parcel-logs": navigate("/viewParcels"); break;
    case "dashboard": navigate(""); break;
    case "parcel-pickup-verification": navigate(""); break;
    case "account-information": navigate("/profile/:id"); break;
    default: break;
  }
  };

  // Filter parcels
  const filteredParcels = parcels.filter((parcel) => {
    const matchesSearch =
      parcel.parcelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.apartmentNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || parcel.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleExportPDF = () => {
   //toast.success("PDF export feature will be implemented");
   if (filteredParcels.length === 0) {
    toast.error("No parcels to export for this filter!");
    return;
  }

  // Pick current month and year (or let user choose via filter)
  const now = new Date();
  const currentMonth = now.getMonth(); // 0 = Jan
  const currentYear = now.getFullYear();

  // Filter only parcels from current month
  const monthlyParcels = filteredParcels.filter((p) => {
    const parcelDate = new Date(p.arrivalDateTime);
    return (
      parcelDate.getMonth() === currentMonth &&
      parcelDate.getFullYear() === currentYear
    );
  });

  if (monthlyParcels.length === 0) {
    toast.error("No parcels found for this month!");
    return;
  }

  // Initialize PDF
  const doc = new jsPDF();
  const monthName = now.toLocaleString("default", { month: "long" });

  // Title
  doc.setFontSize(16);
  doc.text(`Parcel Logs Report - ${monthName} ${currentYear}`, 14, 20);

  doc.autoTable({
  head: [
    ["Parcel ID", "Resident", "Apartment", "Type", "Location", "Status", "Arrival", "Collected"],
  ],
  body: monthlyParcels.map((p) => [
    p.parcelId,
    p.residentName,
    p.apartmentNo,
    p.parcelType,
    p.locId,
    p.status,
    new Date(p.arrivalDateTime).toLocaleDateString(),
    p.collectedDateTime ? new Date(p.collectedDateTime).toLocaleDateString() : "-",
  ]),
  startY: 60,
  styles: { fontSize: 9 },
  headStyles: { fillColor: [79, 70, 229] },
});

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    14,
    pageHeight - 10
  );

  // Save file
  doc.save(`Parcel_Report_${monthName}_${currentYear}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          
        <main className="flex-1 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading parcels...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col overflow-hidden">
        {/* Topic Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Parcel Entries</h1>
          <p className="text-gray-600 text-lg">
            Track and manage all incoming parcels and delivery management
          </p>
        </div>

        {/* Controls Section */}
        <div className="mb-4 space-y-4 flex-shrink-0">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by Parcel ID, Resident Name, or Apartment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Collected">Collected</option>
                  <option value="Removed">Removed</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>

              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                <Download size={18} />
                Export PDF
              </button>

              <Link
                to="/addParcel"
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200 font-medium"
              >
                <Plus size={18} />
                Add Parcel
              </Link>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="overflow-x-auto flex-1">
            <div className="h-full overflow-y-auto">
              <table id="parcelTable" className="w-full min-w-[800px] table-auto">
                <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">Parcel ID</th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">Resident</th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">Apartment No</th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">Location</th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">Arrival</th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">Collected Date</th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredParcels.map((parcel) => (
                    <tr key={parcel._id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-3 py-2 text-sm font-medium text-gray-900">{parcel.parcelId}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{parcel.residentName}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{parcel.apartmentNo}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{parcel.parcelType}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{parcel.locId}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            parcel.status === "Collected"
                              ? "bg-green-100 text-green-800 ring-1 ring-green-600/20"
                              : parcel.status === "Removed"
                              ? "bg-red-100 text-red-800 ring-1 ring-red-600/20"
                              : "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20"
                          }`}
                        >
                          {parcel.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        {formatDate(new Date(parcel.arrivalDateTime))}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        {parcel.collectedDateTime
                          ? formatDate(new Date(parcel.collectedDateTime))
                          : "-"}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/parcel/${parcel._id}`}
                            className="inline-flex items-center p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                            title="Edit parcel"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(parcel._id)}
                            className="inline-flex items-center p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete parcel"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {filteredParcels.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No parcels found</h3>
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No parcels have been added yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KsViewParcels;
