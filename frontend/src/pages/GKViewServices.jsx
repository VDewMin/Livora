import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaFilePdf, FaPlus } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

function GKViewServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
  }, []);

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

  // PDF export
  const handleDownloadAllProcessingPDF = () => {
    const processingServices = services.filter((s) => s.status === "Processing");
    if (processingServices.length === 0) {
      toast.error("No processing services to download.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Service Requests Report", 105, 15, { align: "center" });

    const tableColumn = [
      "Service ID",
      "Apartment No",
      "Contact No",
      "Contact Email",
      "Service Type",
      "Description",
      "Created At",
    ];

    const tableRows = processingServices.map((s) => [
      s.serviceId,
      s.aptNo,
      s.contactNo,
      s.contactEmail,
      s.serviceType,
      s.description,
      s.createdAt ? new Date(s.createdAt).toLocaleString() : "N/A",
    ]);

    doc.autoTable({
      startY: 25,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [56, 189, 248], textColor: 255 },
      theme: "striped",
    });

    doc.save("Services_Report.pdf");
  };

  const filteredServices = services.filter((s) =>
    s.serviceType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-lg font-sens-serif border border-gray-100">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold tracking-wide drop-shadow-md">
          My Service Requests
        </h1>
      </div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div className="flex items-center gap-2 max-w-md w-full ml-0">
          <input
            type="text"
            placeholder="Search by service type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadAllProcessingPDF}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          >
            <FaFilePdf size={16} /> Download PDF
          </button>

          <button
            onClick={() => navigate("/add-service")}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          >
            <FaPlus size={16} /> New Service
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 py-10">Loading services...</p>
      ) : filteredServices.length === 0 ? (
        <p className="text-center text-gray-600 py-10">
          No service requests found.
        </p>
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
                  <tr
                    key={s._id}
                    className="hover:bg-sky-50 transition-all border-b"
                  >
                    <td className="p-3 border">{s.serviceId}</td>
                    <td className="p-3 border">{s.contactNo}</td>
                    <td className="p-3 border">{s.contactEmail}</td>
                    <td className="p-3 border font-medium text-gray-800">
                      {s.serviceType}
                    </td>
                    <td className="p-3 border max-w-[15rem] whitespace-normal break-words">
                      {s.description}
                    </td>
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
                    <td
                      className={`p-3 border ${
                        s.status === "Pending"
                          ? "text-yellow-600"
                          : s.status === "Processing"
                          ? "text-emerald-600"
                          : "text-green-800"
                      }`}
                    >
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
