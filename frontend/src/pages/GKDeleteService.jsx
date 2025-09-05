import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";

function GKDeleteService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);

  useEffect(() => {
    fetchService();
    // eslint-disable-next-line
  }, []);

  const fetchService = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/services/${id}`);
      setService(res.data);
    } catch (err) {
      console.error("Error fetching service", err);
      toast.error("Failed to fetch service");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/services/${id}`);
      toast.success("Service deleted successfully", {
        // navigate after short delay
        duration: 2000,
      });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Error deleting service", err);
      toast.error("Failed to delete service");
    }
  };

  if (!service) return <p>Loading service...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-red-600 text-center">
        Confirm Delete Service
      </h2>

      {/* Service Details Preview */}
      <div className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50">
        <p><span className="font-semibold">Apartment No:</span> {service.aptNo}</p>
        <p><span className="font-semibold">Service ID:</span> {service.serviceId}</p>
        <p><span className="font-semibold">Contact No:</span> {service.contactNo}</p>
        <p><span className="font-semibold">Service Type:</span> {service.serviceType}</p>
        <p><span className="font-semibold">Description:</span> {service.description}</p>
        {service.fileUrl && (
          <div className="mt-2">
            <span className="font-semibold">Attached File:</span>
            {service.fileUrl.endsWith(".mp4") ||
            service.fileUrl.endsWith(".mov") ? (
              <video
                src={service.fileUrl}
                controls
                className="w-full mt-2 rounded"
              />
            ) : (
              <img
                src={service.fileUrl}
                alt="Service File"
                className="w-full mt-2 rounded"
              />
            )}
          </div>
        )}
      </div>

      <p className="text-center text-gray-700 mb-4">
        Are you sure you want to <b className="text-red-600">delete</b> this service request?
      </p>

      <div className="mt-6 flex gap-4 justify-center">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default GKDeleteService;
