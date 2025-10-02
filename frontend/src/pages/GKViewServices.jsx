import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function GKViewServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user-specific services
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
      if (err.response?.status === 401) {
        toast.error("Unauthorized! Please login again.");
        navigate("/login");
      } else {
        toast.error("Failed to fetch services. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllServices();
  }, []);

  // Convert file buffer to base64
  const getFileSrc = (fileUrl) => {
    if (!fileUrl || !fileUrl.data || !fileUrl.contentType) return null;
    try {
      const base64String = btoa(
        new Uint8Array(fileUrl.data.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      return `data:${fileUrl.contentType};base64,${base64String}`;
    } catch (error) {
      console.error("File conversion error:", error);
      return null;
    }
  };

  // Generate PDF with table + image
  const handleDownloadPDF = (service) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Service Request Details", 14, 20);

    // Table data
    const tableData = [
      ["Apartment No", service.aptNo],
      ["Service ID", service.serviceId],
      ["Contact No", service.contactNo],
      ["Contact Email", service.contactEmail],
      ["Service Type", service.serviceType],
      ["Description", service.description],
      ["Status", service.status],
      ["Created At", service.createdAt ? new Date(service.createdAt).toLocaleString() : "N/A"],
    ];

    autoTable(doc, {
      head: [["Field", "Value"]],
      body: tableData,
      startY: 30,
      theme: "grid",
    });

    // Add image if available
    const fileSrc = getFileSrc(service.fileUrl);
    if (fileSrc && service.fileUrl.contentType.startsWith("image/")) {
      const finalY = doc.lastAutoTable.finalY + 10; // Place image below table
      doc.addImage(fileSrc, "JPEG", 14, finalY, 80, 60); // (x, y, width, height)
    }

    // Save file
    doc.save(`service-${service._id}.pdf`);
  };

  return (
    <div className="p-6 max-w-8xl mx-auto font-poppins">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Service Requests</h1>
        <button
          onClick={() => navigate("/add-service")}
          className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Service
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading services...</p>
      ) : services.length === 0 ? (
        <p className="text-gray-600">No service requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Apartment</th>
                <th className="p-3 border text-left">Service ID</th>
                <th className="p-3 border text-left">Contact No</th>
                <th className="p-3 border text-left">Contact Email</th>
                <th className="p-3 border text-left">Service Type</th>
                <th className="p-3 border text-left">Description</th>
                <th className="p-3 border text-left">Attachment</th>
                <th className="p-3 border text-left">Created At</th>
                <th className="p-3 border text-left">Status</th>
                <th className="p-3 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => {
                const fileSrc = getFileSrc(s.fileUrl);
                return (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{s.aptNo}</td>
                    <td className="p-3 border">{s.serviceId}</td>
                    <td className="p-3 border">{s.contactNo}</td>
                    <td className="p-3 border">{s.contactEmail}</td>
                    <td className="p-3 border">{s.serviceType}</td>
                    <td className="p-3 border w-5xl">{s.description}</td>
                    <td className="p-3 border">
                      {fileSrc ? (
                        <img
                          src={fileSrc}
                          alt="Uploaded"
                          className="w-32 h-20 object-cover rounded-md"
                        />
                      ) : (
                        "No file"
                      )}
                    </td>
                    <td className="p-3 border text-sm text-gray-600">
                      {s.createdAt ? new Date(s.createdAt).toLocaleString() : "N/A"}
                    </td>
                    <td
                      className={`p-3 border ${
                        s.status === "Pending"
                          ? "text-yellow-600"
                          : s.status === "Processing"
                          ? "text-green-600"
                          : "text-green-800"
                      }`}
                    >
                      {s.status || "Pending"}
                    </td>
                    <td className="p-3 border flex gap-2">
                      {s.status === "Pending" && (
                      <button
                        onClick={() => navigate(`/update-service/${s._id}`)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                      >
                        <FaEdit size={18} />
                      </button> )}
                      <button
                        onClick={() => navigate(`/delete-service/${s._id}`)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <FaTrash size={18} />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(s)}
                        className="text-green-600 hover:text-green-800 p-2"
                      >
                        <FaFilePdf size={18} />
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
