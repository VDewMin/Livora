import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function GKServiceRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    aptNo: "",
    contactNo: "",
    contactEmail: "",
    serviceType: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user details after login
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    setFormData((prev) => ({
      ...prev,
      aptNo: storedUser.apartmentNo || "",
      contactNo: storedUser.phoneNo || "",
      contactEmail: storedUser.email || "",
    }));

    if (!storedUser.apartmentNo || !storedUser.email || !storedUser.phoneNo) {
      console.warn("Missing user details in localStorage");
    }
  }, []);

  // Handle input changes for fields that user can edit
  const handleChange = (e) => {
    const { name, files, value } = e.target;

    if (name === "fileUrl") {
      if (files && files[0]) {
        const fileType = files[0].type; // check MIME type
        if (fileType !== "image/png") {
          toast.error("Only PNG images are allowed!");
          e.target.value = null; // reset input
          setFile(null);
          return;
        }
        setFile(files[0]);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = new FormData();
      Object.keys(formData).forEach((key) =>
        requestData.append(key, formData[key])
      );
      if (file) requestData.append("file", file);

      await axios.post("http://localhost:5001/api/services", requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Service request submitted successfully!", {
        position: "top-center",
      });
      navigate("/resident/user-view");

      // Reset only editable fields
      setFormData((prev) => ({
        ...prev,
        serviceType: "",
        description: "",
      }));
      setFile(null);
    } catch (err) {
      console.error("Error submitting service request:", err);
      toast.error("Failed to submit request. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl p-6 mt-10 shadow-md font-poppins">
      <h2 className="text-xl font-bold mb-6 text-center">Service Request</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Apartment No */}
        <div>
          <label className="block font-semibold mb-1">Apartment No</label>
          <input
            type="text"
            name="aptNo"
            value={formData.aptNo}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Contact Email */}
        <div>
          <label className="block font-semibold mb-1">Contact Email</label>
          <input
            type="text"
            name="contactEmail"
            value={formData.contactEmail}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Contact No */}
        <div>
          <label className="block font-semibold mb-1">Contact No</label>
          <input
            type="text"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>

        {/* Service Type */}
        <div>
          <label className="block font-semibold mb-1">Service Type</label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- Select Service Type --</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block font-semibold mb-1">Upload PNG Image</label>
          <input
            type="file"
            name="fileUrl"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default GKServiceRequest;
