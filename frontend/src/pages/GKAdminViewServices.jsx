import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [techInputs, setTechInputs] = useState({}); // store technician names per row
  const [dateInputs, setDateInputs] = useState({}); // store dates per row ✅

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/services");
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching service requests:", err);
    }
  };

  const handleAssign = async (id) => {
    try {
      const assignedTechnician = techInputs[id];
      const assignedDate = dateInputs[id];

      if (!assignedTechnician || !assignedDate) {
        alert("Please enter technician name and date");
        return;
      }

      await axios.put(`http://localhost:5001/api/services/${id}/assign`, {
        assignedTechnician,
        assignedDate,
      });

      fetchRequests(); // refresh list
    } catch (err) {
      console.error("Error assigning technician:", err);
    }
  };

  return (
    <div className="max-w-8xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        All Service Requests
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
            {requests.map((req) => (
              <tr key={req._id}>
                <td className="p-2 border">{req.aptNo}</td>
                <td className="p-2 border">{req.contactNo}</td>
                <td className="p-2 border">{req.contactEmail || "N/A"}</td>
                <td className="p-2 border">{req.serviceType}</td>
                <td className="p-2 border">{req.description}</td>
                <td className="p-2 border">
                  {req.fileUrl ? (
                    req.fileUrl.match(/\.(mp4|mov|avi)$/) ? (
                      <video controls className="w-32 h-20 object-cover">
                        <source
                          src={`http://localhost:5001${req.fileUrl}`}
                          type="video/mp4"
                        />
                      </video>
                    ) : (
                      <img
                        src={`http://localhost:5001${req.fileUrl}`}
                        alt="Uploaded"
                        className="w-32 h-20 object-cover rounded-md"
                      />
                    )
                  ) : (
                    "No File"
                  )}
                </td>
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
                    {req.status}
                  </span>
                </td>
                <td className="p-2 border">
                  {req.assignedTechnician
                    ? `${req.assignedTechnician} (${req.assignedDate ? new Date(req.assignedDate).toLocaleDateString() : "No Date"})`
                    : "Not Assigned"}
                </td>
                <td className="p-2 border">
                  {req.status === "Pending" ? (
                    <div className="flex flex-col gap-2">
                      {/* Technician name input */}
                      <input
                        type="text"
                        placeholder="Technician name"
                        value={techInputs[req._id] || ""}
                        onChange={(e) =>
                          setTechInputs({ ...techInputs, [req._id]: e.target.value })
                        }
                        className="border p-1 rounded"
                      />
                      {/* Date input */}
                      <input
                        type="date"
                        value={dateInputs[req._id] || ""}
                        onChange={(e) =>
                          setDateInputs({ ...dateInputs, [req._id]: e.target.value })
                        }
                        className="border p-1 rounded"
                      />
                      {/* Assign button */}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminServiceRequests;
