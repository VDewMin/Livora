import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import technicians from "../components/GKTechnician"; // Import technician data
import { Wrench, XCircle } from "lucide-react";

function AdminServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignedTechnician, setAssignedTechnician] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
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
  const handleAssign = async () => {
    try {
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

      await axios.put(
        `http://localhost:5001/api/services/${selectedRequest._id}/assign`,
        {
          assignedTechnician,
          assignedDate,
        }
      );

      toast.success("Technician assigned successfully!");
      setSelectedRequest(null);
      fetchRequests(); // refresh list
    } catch (err) {
      console.error("Error assigning technician:", err);
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 p-4 rounded-xl text-white mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wrench /> All Service Requests
          </h2>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="p-3 border">Apt No</th>
                <th className="p-3 border">Contact</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Service Type</th>
                <th className="p-3 border w-64">Description</th>
                <th className="p-3 border">File</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Technician</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-gray-500">
                    No service requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const fileSrc = getFileSrc(req.fileUrl);

                  return (
                    <tr
                      key={req._id}
                      className="hover:bg-sky-50 transition-colors duration-200"
                    >
                      <td className="p-3 border">{req.aptNo}</td>
                      <td className="p-3 border">{req.contactNo}</td>
                      <td className="p-3 border">{req.contactEmail}</td>
                      <td className="p-3 border">{req.serviceType}</td>
                      <td className="p-3 border break-words max-w-64">
                        {req.description}
                      </td>
                      <td className="p-3 border text-center">
                        {fileSrc ? (
                          <button
                            onClick={() => setPreviewImage(fileSrc)}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            View
                          </button>
                        ) : (
                          "No File"
                        )}
                      </td>
                      <td className="p-3 border">
                        <span
                          className={`px-2 py-1 rounded text-sm font-semibold ${
                            req.status === "Pending"
                              ? "bg-yellow-100 text-yellow-600"
                              : req.status === "Processing"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3 border text-gray-700">
                        {req.assignedTechnician
                          ? `${req.assignedTechnician} (${
                              req.assignedDate
                                ? new Date(req.assignedDate).toLocaleDateString()
                                : "No Date"
                            })`
                          : "Not Assigned"}
                      </td>
                      <td className="p-3 border text-center">
                        {req.status === "Pending" ? (
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="bg-sky-600 text-white px-4 py-1.5 rounded-lg hover:bg-sky-500 transition-all shadow-sm"
                          >
                            Assign
                          </button>
                        ) : (
                          <span className="text-gray-500">Assigned</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technician Assignment Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
            >
              <XCircle size={24} />
            </button>

            <h3 className="text-2xl font-bold text-sky-700 mb-4">
              Assign Technician
            </h3>

            <p className="text-gray-600 mb-6">
              <strong>Service:</strong> {selectedRequest.serviceType} <br />
              <strong>Apartment:</strong> {selectedRequest.aptNo}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Select Technician
                </label>
                <select
                  value={assignedTechnician}
                  onChange={(e) => setAssignedTechnician(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                >
                  <option value="">-- Select Technician --</option>
                  {Object.entries(technicians).map(([category, techList]) => (
                    <optgroup key={category} label={category}>
                      {techList.map((tech) => (
                        <option key={tech.id} value={tech.name}>
                          {tech.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Assign Date
                </label>
                <input
                  type="date"
                  value={assignedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setAssignedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                />
              </div>

              <button
                onClick={handleAssign}
                className="w-full bg-sky-600 text-white py-2.5 rounded-lg font-semibold hover:bg-sky-500 transition-all shadow-md"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

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
