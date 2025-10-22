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
import html2pdf from "html2pdf.js";

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
      case "parcel-logs":
        navigate("/viewParcels");
        break;
      case "dashboard":
        navigate("");
        break;
      case "parcel-pickup-verification":
        navigate("");
        break;
      case "account-information":
        navigate("/profile/:id");
        break;
      default:
        break;
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
    if (filteredParcels.length === 0) {
      toast.error("No parcels to export for this filter!");
      return;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthName = now.toLocaleString("default", { month: "long" });

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

    const pdfDiv = document.createElement("div");
    pdfDiv.className = "min-h-screen bg-slate-100 p-8";

    pdfDiv.innerHTML = `
    <div class="max-w-5xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
      <!-- Header -->
      <div class="border-b-4 border-blue-600 p-8 bg-gradient-to-r from-blue-50 to-blue-100">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h1 class="text-4xl font-bold text-blue-700">Pearl Residencies</h1>
            <p class="text-gray-600 text-lg">Premium Living Spaces</p>
          </div>
          <div class="text-right">
            <h2 class="text-2xl font-bold text-gray-800">Parcel Log Report</h2>
            <p class="text-gray-600 text-sm mt-1">${monthName} ${currentYear}</p>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="p-8 bg-gray-50 border-b-2 border-gray-200">
        <h3 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
          Parcel Records
        </h3>
        <table class="w-full border-collapse text-sm">
          <thead class="bg-blue-600 text-white text-left">
            <tr>
              <th class="p-3">Parcel ID</th>
              <th class="p-3">Resident</th>
              <th class="p-3">Apartment</th>
              <th class="p-3">Type</th>
              <th class="p-3">Location</th>
              <th class="p-3">Status</th>
              <th class="p-3">Arrival</th>
              <th class="p-3">Collected</th>
            </tr>
          </thead>
          <tbody>
            ${monthlyParcels
              .map(
                (p, idx) => `
                <tr class="${idx % 2 === 0 ? "bg-white" : "bg-gray-100"}">
                  <td class="p-3 border">${p.parcelId}</td>
                  <td class="p-3 border">${p.residentName}</td>
                  <td class="p-3 border">${p.apartmentNo}</td>
                  <td class="p-3 border">${p.parcelType}</td>
                  <td class="p-3 border">${p.locId}</td>
                  <td class="p-3 border font-semibold ${
                    p.status === "Collected"
                      ? "text-green-600"
                      : p.status === "Pending"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }">${p.status}</td>
                  <td class="p-3 border">${new Date(
                    p.arrivalDateTime
                  ).toLocaleDateString()}</td>
                  <td class="p-3 border">${
                    p.collectedDateTime
                      ? new Date(p.collectedDateTime).toLocaleDateString()
                      : "-"
                  }</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <!-- Summary -->
      <div class="p-8 bg-blue-50 border-b-2 border-gray-200">
        <h3 class="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
          Summary
        </h3>
        <div class="flex justify-between text-gray-700">
          <p>Total Parcels for ${monthName} ${currentYear}:</p>
          <p class="font-bold text-blue-700">${monthlyParcels.length}</p>
        </div>
      </div>

      <!-- Notes -->
      <div class="p-8 bg-gray-50 border-b-2 border-gray-200">
        <h3 class="font-bold text-gray-800 mb-3">Notes</h3>
        <ul class="space-y-2 text-sm text-gray-700 list-disc list-inside">
          <li>This is a system-generated monthly report. No signature required.</li>
          <li>Please verify parcel details with the resident management system.</li>
          <li>For discrepancies, contact the administration office.</li>
        </ul>
      </div>

      <!-- Footer -->
      <div class="p-8 bg-gradient-to-r from-blue-50 to-blue-100 border-t-4 border-blue-600 text-center">
        <p class="font-semibold text-gray-800 text-lg mb-2">Pearl Residencies</p>
        <p class="text-gray-700">Premium Living Spaces</p>
        <p class="text-gray-700 text-sm mt-2">Customer Support: +971 4 XXXX XXXX</p>
        <p class="text-gray-700 text-sm">Website: www.pearlresidencies.com</p>
        <div class="text-xs text-gray-600 mt-6 pt-4 border-t border-gray-300">
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  `;

    const opt = {
      margin: 0.5,
      filename: `Parcel_Report_${monthName}_${currentYear}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(pdfDiv).save();
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Parcel Entries
          </h1>
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
              <table
                id="parcelTable"
                className="w-full min-w-[800px] table-auto"
              >
                <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                      Parcel ID
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                      Resident
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                      Apartment No
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                      Location
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                      Arrival
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                      Collected Date
                    </th>
                    <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredParcels.map((parcel) => (
                    <tr
                      key={parcel._id}
                      className="hover:bg-gray-50/50 transition-colors duration-150"
                    >
                      <td className="px-3 py-2 text-sm font-medium text-gray-900">
                        {parcel.parcelId}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        {parcel.residentName}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        {parcel.apartmentNo}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        {parcel.parcelType}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700">
                        {parcel.locId}
                      </td>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No parcels found
                  </h3>
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
