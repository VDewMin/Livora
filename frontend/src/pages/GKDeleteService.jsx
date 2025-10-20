import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function GKDeleteService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [preview, setPreview] = useState(null);

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

  // Fetch service details
  useEffect(() => {
    const fetchService = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You are not logged in. Please login first.");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5001/api/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setService(res.data);
        if (res.data.fileUrl) {
          setPreview(getFileSrc(res.data.fileUrl));
        }
      } catch (err) {
        console.error("Error fetching service:", err);
        toast.error("Failed to fetch service details");
      }
    };

    fetchService();
  }, [id, navigate]);

  // Handle delete
  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Unauthorized. Please login again.");
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Service deleted successfully!", { position: "top-center" });
      setTimeout(() => navigate("/resident/user-view"), 1500);
    } catch (err) {
      console.error("Error deleting service:", err);
      toast.error("Failed to delete service");
    }
  };

  if (!service)
    return <p className="text-center mt-10 text-gray-600">Loading service details...</p>;

  return (
    <div className="mt-0 bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-auto overflow-hidden border border-gray-100 font-sens-serif">
      <div className="bg-gradient-to-r from-sky-600 to-indigo-600 p-3 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🗑️ Delete Service Request
        </h2>
        <p className="text-blue-100 text-sm mt-1">
            Please review the details before deleting this service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-2 p-5">
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Apartment Number
              </label>
              <input
                type="text"
                value={service.aptNo}
                readOnly
                className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Service ID
              </label>
              <input
                type="text"
                value={service.serviceId}
                readOnly
                className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              value={service.contactNo}
              readOnly
              className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="text"
              value={service.contactEmail}
              readOnly
              className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Service Type
            </label>
            <input
              type="text"
              value={service.serviceType}
              readOnly
              className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 ">
              Description
            </label>
            <textarea
              value={service.description}
              readOnly
              className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-100 resize-none cursor-not-allowed whitespace-normal break-words"
            />
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="flex flex-col items-center justify-start gap-4 bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
          {preview && (
            <div className="w-full">
              <p className="font-medium text-gray-600 text-sm mb-4 text-center">
                Attached Image
              </p>
              <img
                src={preview}
                alt="Service File"
                className="rounded-xl border border-gray-300 w-full shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <p className="text-center text-gray-700 text-lg">
        Are you sure you want to{" "}
        <span className="font-semibold text-red-600">delete</span> this service request?
      </p>

      <div className="flex gap-5 p-5">
        <button
          onClick={handleDelete}
          className="w-1/2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-[1.02]"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => navigate("/resident/user-view")}
          className="w-1/2 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-[1.02]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default GKDeleteService;
