import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";

function GKDeleteService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/services/${id}`);
      setService(res.data);
    } catch (err) {
      console.error("Error fetching service", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/services/${id}`);
      navigate("/view-services");
    } catch (err) {
      console.error("Error deleting service", err);
    }
  };

  if (!service) return <p>Loading service...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-red-600">
        Confirm Delete Service
      </h2>
      <p>
        Are you sure you want to delete service request for apartment{" "}
        <b>{service.aptNo}</b> (Room {service.serviceId})?
      </p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => navigate("/view-services")}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default GKDeleteService;
