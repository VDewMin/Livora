import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";

function GKDeleteService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchService();
    // eslint-disable-next-line
  }, []);

  const fetchService = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/services/${id}`);
      setService(res.data);

      // Build preview if file exists
      if (res.data.fileUrl && res.data.fileUrl.data) {
        const base64String = btoa(
          new Uint8Array(res.data.fileUrl.data.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        setPreviewUrl(
          `data:${res.data.fileUrl.contentType};base64,${base64String}`
        );
      }
    } catch (err) {
      console.error("Error fetching service", err);
      toast.error("Failed to fetch service");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/services/${id}`);
      toast.success("Service deleted successfully", { duration: 2000 });
      setTimeout(() => navigate("/resident/user-view"), 2000);
    } catch (err) {
      console.error("Error deleting service", err);
      toast.error("Failed to delete service");
    }
  };

  if (!service) return <p className="text-center mt-10">Loading service...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center font-poppins">
        Delete Service
      </h2>

      {/* Service Details */}
      <div className="space-y-3 mb-6">
        <div>
          <label className="block text-sm font-semibold font-poppins">
            Apartment Number
          </label>
          <input
            type="text"
            value={service.aptNo}
            disabled
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 font-poppins"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold font-poppins">
            Service ID
          </label>
          <input
            type="text"
            value={service.serviceId}
            disabled
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 font-poppins"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold font-poppins">
            Contact Number
          </label>
          <input
            type="text"
            value={service.contactNo}
            disabled
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 font-poppins"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold font-poppins">
            Contact Email
          </label>
          <input
            type="text"
            value={service.contactEmail}
            disabled
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 font-poppins"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold font-poppins">
            Service Type
          </label>
          <input
            type="text"
            value={service.serviceType}
            disabled
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 font-poppins"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold font-poppins">
            Description
          </label>
          <textarea
            value={service.description}
            disabled
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 resize-none font-poppins"
          />
        </div>

        {/* Attached File Preview */}
        {previewUrl && (
          <div>
            <label className="block text-sm font-semibold font-poppins">
              Attached File
            </label>
            {service.fileUrl.contentType.startsWith("video/") ? (
              <video src={previewUrl} controls className="w-full mt-2 rounded-lg" />
            ) : (
              <img src={previewUrl} alt="Service File" className="w-full mt-2 rounded-lg" />
            )}
          </div>
        )}
      </div>

      <p className="text-center text-gray-700 mb-6 font-poppins">
        Are you sure you want to{" "}
        <b className="text-red-600 font-poppins">delete</b> this service request?
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleDelete}
          className="w-1/2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-poppins"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => navigate("/resident/user-view")}
          className="w-1/2 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition font-poppins"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default GKDeleteService;
