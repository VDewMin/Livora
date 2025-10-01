import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import technicians from "../components/GKTechnician"; //Import technician data

function AdminServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [techInputs, setTechInputs] = useState({});
  const [dateInputs, setDateInputs] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch all service requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/services");
      setRequests(res.data || []);
    } catch (err) {
      console.error("Error fetching service requests:", err);
    }
  };

  // Assign technician + date
  const handleAssign = async (id) => {
    try {
      const assignedTechnician = techInputs[id];
      const assignedDate = dateInputs[id];

      if (!assignedTechnician || !assignedDate) {
        toast.error("Please select technician and date");
        return;
      }

      // Prevent past dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const chosenDate = new Date(assignedDate);

      if (chosenDate < today) {
        toast.error("You cannot select a past date");
        return;
      }

      await axios.put(`http://localhost:5001/api/services/${id}/assign`, {
        assignedTechnician,
        assignedDate,
      });
      toast.success("Technician assigned successfully");
      fetchRequests(); // refresh list
    } catch (err) {
      console.error(" Error assigning technician:", err);
      toast.error("Failed to assign technician");
    }
  };

  // Convert Buffer to Base64 string
  const getFileSrc = (fileUrl) => {
    if (!fileUrl || !fileUrl.data || !fileUrl.contentType) return null;

    const base64String = btoa(
      new Uint8Array(fileUrl.data.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );

    return `data:${fileUrl.contentType};base64,${base64String}`;
  };

  return (
    <div className="max-w-8xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md font-poppins">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📋 All Service Requests
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Apt No</th>
              <th className="p-2 border">Contact No</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Service Type</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">File</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Technician</th>
              <th className="p-2 border">Assign</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No service requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => {
                const fileSrc = getFileSrc(req.fileUrl);

                return (
                  <tr key={req._id}>
                    <td className="p-2 border">{req.aptNo || "N/A"}</td>
                    <td className="p-2 border">{req.contactNo || "N/A"}</td>
                    <td className="p-2 border">{req.contactEmail || "N/A"}</td>
                    <td className="p-2 border">{req.serviceType || "N/A"}</td>
                    <td className="p-2 border">{req.description || "-"}</td>

                    {/* File column */}
                    <td className="p-3 border">
                      {fileSrc && req.fileUrl.contentType.startsWith("image/") ? (
                        <img
                          src={fileSrc}
                          alt="Uploaded"
                          className="w-32 h-20 object-cover rounded-md cursor-pointer hover:opacity-80"
                          onClick={() => setPreviewImage(fileSrc)}
                        />
                      ) : fileSrc ? (
                        <a
                          href={fileSrc}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View File
                        </a>
                      ) : (
                        "No file"
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-2 border">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          req.status === "Pending"
                            ? "bg-yellow-500"
                            : req.status === "Processing"
                            ? "bg-blue-500"
                            : "bg-green-600"
                        }`}
                      >
                        {req.status || "Pending"}
                      </span>
                    </td>

                    {/* Technician */}
                    <td className="p-2 border">
                      {req.assignedTechnician
                        ? `${req.assignedTechnician} (${
                            req.assignedDate
                              ? new Date(req.assignedDate).toLocaleDateString()
                              : "No Date"
                          })`
                        : "Not Assigned"}
                    </td>

                    {/* Assign Technician */}
                    <td className="p-2 border">
                      {req.status === "Pending" ? (
                        <div className="flex flex-col gap-2">
                          {/* Searchable Dropdown */}
                          <select
                            value={techInputs[req._id] || ""}
                            onChange={(e) =>
                              setTechInputs({
                                ...techInputs,
                                [req._id]: e.target.value,
                              })
                            }
                            className="border p-1 rounded"
                          >
                            <option value="">Select Technician</option>
                            {Object.entries(technicians).map(
                              ([category, techList]) => (
                                <optgroup key={category} label={category}>
                                  {techList.map((tech) => (
                                    <option key={tech.id} value={tech.name}>
                                      {tech.name}
                                    </option>
                                  ))}
                                </optgroup>
                              )
                            )}
                          </select>

                          {/* Date Picker */}
                          <input
                            type="date"
                            value={dateInputs[req._id] || ""}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) =>
                              setDateInputs({
                                ...dateInputs,
                                [req._id]: e.target.value,
                              })
                            }
                            className="border p-1 rounded"
                          />

                          <button
                            onClick={() => handleAssign(req._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Assign
                          </button>
                        </div>
                      ) : (
                        "Assigned"
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <button
              className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded"
              onClick={() => setPreviewImage(null)}
            >
              ✖
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminServiceRequests;
