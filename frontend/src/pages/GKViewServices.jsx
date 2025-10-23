import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaFilePdf, FaPlus } from "react-icons/fa";
import html2pdf from "html2pdf.js";

function GKViewServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const fetchAllServices = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("You are not logged in. Please login first.");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get("http://localhost:5001/api/services/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
      toast.error("Failed to fetch services. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllServices();

    // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFileSrc = (fileUrl) => {
    if (!fileUrl || !fileUrl.data || !fileUrl.contentType) return null;
    try {
      const uintArray = new Uint8Array(fileUrl.data.data);
      let binary = "";
      uintArray.forEach((byte) => (binary += String.fromCharCode(byte)));
      const base64String = btoa(binary);
      return `data:${fileUrl.contentType};base64,${base64String}`;
    } catch (error) {
      console.error("File conversion error:", error);
      return null;
    }
  };

  const handleDownloadAllPDF = (statusType) => {
    const filtered = services.filter((service) => service.status === statusType);

    if (filtered.length === 0) {
      toast.error(`No ${statusType.toLowerCase()} services found.`);
      return;
    }

    const pdfDiv = document.createElement("div");
    pdfDiv.className = "min-h-screen bg-slate-100 p-8";

    const rows = filtered
      .map(
        (s, index) => `
        <tr class="border-b">
          <td class="p-3 border text-center">${index + 1}</td>
          <td class="p-3 border">${s.serviceId}</td>
          <td class="p-3 border">${s.aptNo}</td>
          <td class="p-3 border">${s.contactNo}</td>
          <td class="p-3 border">${s.contactEmail}</td>
          <td class="p-3 border">${s.serviceType}</td>
          <td class="p-3 border max-w-[15rem]">${s.description}</td>
          <td class="p-3 border">${new Date(s.createdAt).toLocaleString()}</td>
          <td class="p-3 border font-semibold ${
            s.status === "Processing"
              ? "text-emerald-600"
              : s.status === "Pending"
              ? "text-yellow-600"
              : "text-green-800"
          }">${s.status}</td>
        </tr>
      `
      )
      .join("");

    pdfDiv.innerHTML = `
      <div class="max-w-6xl mx-auto bg-white shadow-2xl">
        <div class="border-b-4 border-blue-600 p-8 bg-gradient-to-r from-blue-50 to-blue-100">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-4xl font-bold text-blue-700">Pearl Residencies</h1>
              <p class="text-gray-600 text-lg">Premium Living Spaces</p>
            </div>
            <div class="text-right">
              <h2 class="text-2xl font-bold text-gray-800">${statusType.toUpperCase()} SERVICES</h2>
              <p class="text-gray-600 text-sm mt-1">Generated on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div class="p-8">
          <table class="w-full border-collapse text-sm text-gray-800">
            <thead class="bg-blue-100 text-blue-800">
              <tr>
                <th class="p-3 border">#</th>
                <th class="p-3 border">Service ID</th>
                <th class="p-3 border">Apartment No</th>
                <th class="p-3 border">Contact No</th>
                <th class="p-3 border">Email</th>
                <th class="p-3 border">Service Type</th>
                <th class="p-3 border">Description</th>
                <th class="p-3 border">Created At</th>
                <th class="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div class="p-8 bg-gradient-to-r from-blue-50 to-blue-100 border-t-4 border-blue-600 text-center">
          <p class="font-semibold text-gray-800 text-lg mb-2">Pearl Residencies</p>
          <p class="text-gray-700">Premium Living Spaces</p>
          <p class="text-gray-700 text-sm mt-2">Customer Support: +971 4 XXXX XXXX</p>
          <p class="text-gray-700 text-sm">Website: www.pearlresidencies.com</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 0.5,
      filename: `${statusType}_Services_${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a3", orientation: "landscape" },
    };

    html2pdf().set(opt).from(pdfDiv).save();
  };

  const filteredServices = services.filter((s) =>
    s.serviceType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-lg font-sans border border-gray-100">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold tracking-wide drop-shadow-md">
          My Service Requests
        </h1>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div className="flex items-center gap-2 max-w-md w-full">
          <input
            type="text"
            placeholder="Search by service type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          >
            <FaFilePdf size={16} /> Download PDF
          </button>

          {showDropdown && (
            <div className="absolute right-90 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <button
                onClick={() => {
                  handleDownloadAllPDF("Pending");
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-800 rounded hover:bg-emerald-500">
                Pending Services
              </button>
              <button
                onClick={() => {
                  handleDownloadAllPDF("Processing");
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-800  rounded hover:bg-emerald-500"
              >
                 Processing Services
              </button>
            </div>
          )}

          <button
            onClick={() => navigate("/add-service")}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow-md transition-all">
            <FaPlus size={16} /> New Service
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 py-10">Loading services...</p>
      ) : filteredServices.length === 0 ? (
        <p className="text-center text-gray-600 py-10">No service requests found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="p-3 border text-left">Service ID</th>
                <th className="p-3 border text-left">Contact No</th>
                <th className="p-3 border text-left">Contact Email</th>
                <th className="p-3 border text-left">Service Type</th>
                <th className="p-3 border text-left max-w-[15rem]">Description</th>
                <th className="p-3 border text-left">Attachment</th>
                <th className="p-3 border text-left">Status</th>
                <th className="p-3 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((s) => {
                const fileSrc = getFileSrc(s.fileUrl);
                return (
                  <tr key={s._id} className="hover:bg-sky-50 transition-all border-b">
                    <td className="p-3 border">{s.serviceId}</td>
                    <td className="p-3 border">{s.contactNo}</td>
                    <td className="p-3 border">{s.contactEmail}</td>
                    <td className="p-3 border font-medium text-gray-800">{s.serviceType}</td>
                    <td className="p-3 border max-w-[15rem] whitespace-normal break-words">{s.description}</td>
                    <td className="p-3 border">
                      {fileSrc ? (
                        <img
                          src={fileSrc}
                          alt="Uploaded"
                          className="w-28 h-20 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        "No file"
                      )}
                    </td>
                    <td className={`p-3 border ${
                      s.status === "Pending"
                        ? "text-yellow-600"
                        : s.status === "Processing"
                        ? "text-emerald-600"
                        : "text-green-800"
                    }`}>
                      {s.status || "Pending"}
                    </td>
                    <td className="p-3 flex flex-col gap-2">
                      <button
                        onClick={() =>
                          s.status === "Pending"
                            ? navigate(`/update-service/${s._id}`)
                            : toast.error("Cannot edit a processing service")
                        }
                        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() =>
                          s.status === "Pending"
                            ? navigate(`/delete-service/${s._id}`)
                            : toast.error("Cannot delete a processing service")
                        }
                        className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GKViewServices;
