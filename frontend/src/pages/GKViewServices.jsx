import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { FaEdit, FaTrash } from "react-icons/fa";

function GKViewServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllServices();
  }, []);

  const fetchAllServices = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/services");
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`http://localhost:5001/api/services/${id}`);
        setServices(services.filter((s) => s._id !== id));
      } catch (err) {
        console.error("Error deleting service", err);
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-poppins">
      {/* Header with button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Service Requests</h1>
        <button
          onClick={() => navigate("/add-service")}
          className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Service
        </button>
      </div>

      {/* Service requests table */}
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
                <th className="p-3 border text-left">Contact</th>
                <th className="p-3 border text-left">Service Type</th>
                <th className="p-3 border text-left">Description</th>
                <th className="p-3 border text-left">Attachment</th>
                <th className="p-3 border text-left">Created At</th>
                <th className="p-3 border text-left">Status</th>
                <th className="p-3 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{s.aptNo}</td>
                  <td className="p-3 border">{s.serviceId}</td>
                  <td className="p-3 border">{s.contactNo}</td>
                  <td className="p-3 border">{s.serviceType}</td>
                  <td className="p-3 border max-w-xs">{s.description}</td>
                  <td className="p-3 border">
                    {s.fileUrl ? (
                      <a
                        href={s.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Attachment
                      </a>
                    ) : (
                      "No file"
                    )}
                  </td>
                  <td className="p-3 border text-sm text-gray-600">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 border">{s.status}</td>
                  <td className="p-3 border gap-3 flex">
                    <button
                      onClick={() => navigate(`/update-service/${s._id}`)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GKViewServices;
