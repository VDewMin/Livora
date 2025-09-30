import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

function GKUpdateService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    aptNo: "",
    serviceId: "",
    contactNo: "",
    contactEmail: "",
    serviceType: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    fetchService();
    // eslint-disable-next-line
  }, []);

  const fetchService = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("You are not logged in.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5001/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { fileUrl, ...otherFields } = res.data;
      setFormData(otherFields);

      if (fileUrl) {
        setPreview(getFileSrc(fileUrl));
      }
    } catch (err) {
      console.error("Error fetching service", err);
      toast.error("Failed to load service");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "contactNo") {
      const contact = /^\d*$/;
      if (!contact.test(value)) {
        setErrors({ ...errors, contactNo: "Only numbers are allowed" });
        return;
      } else if (value.length > 10) {
        setErrors({ ...errors, contactNo: "Contact number must be 10 digits" });
        return;
      } else {
        setErrors({ ...errors, contactNo: "" });
      }
    }

    if (name === "contactEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors({ ...errors, contactEmail: "Please enter a valid email address" });
      } else {
        setErrors({ ...errors, contactEmail: "" });
      }
      setFormData({ ...formData, [name]: value });
      return;
    }

    if (name === "fileUrl") {
      const selectedFile = files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contactNo.length !== 10) {
      setErrors({ ...errors, contactNo: "Contact number must be exactly 10 digits" });
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Unauthorized. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });
      if (file) form.append("fileUrl", file);

      await axios.put(`http://localhost:5001/api/services/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Service updated successfully");
      navigate("/resident/user-view");
    } catch (err) {
      console.error("Error updating service", err);
      toast.error("Failed to update service");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl p-6 mt-10 shadow-md font-poppins">
      <h2 className="text-xl font-bold mb-4 text-center">Update Service</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Apartment No & Service ID */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Apartment Number</label>
            <input
              type="text"
              name="aptNo"
              value={formData.aptNo}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Service ID</label>
            <input
              type="text"
              name="serviceId"
              value={formData.serviceId}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
          </div>
        </div>

        {/* Contact No */}
        <label className="block font-semibold mb-1">Contact Number</label>
        <input
          type="text"
          name="contactNo"
          value={formData.contactNo}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded bg-gray-100"
        />
        {errors.contactNo && <p className="text-red-600 text-sm">{errors.contactNo}</p>}

        {/* Email */}
        <label className="block font-semibold mb-1">Contact Email</label>
        <input
          type="text"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded bg-gray-100"
        />
        {errors.contactEmail && <p className="text-red-600 text-sm">{errors.contactEmail}</p>}

        {/* Service Type */}
        <label className="block font-semibold mb-1">Service Type</label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded bg-gray-100"
        >
          <option value="">-- Select Service Type --</option>
          <option value="Electrical">Electrical</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Other">Other</option>
        </select>

        {/* Description */}
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded bg-gray-100"
        />

        {/* File Upload */}
        <div>
          <label className="block font-semibold mb-1">Upload Image or Video</label>
          <input
            type="file"
            name="fileUrl"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-4">
            {file?.type?.startsWith("video") ? (
              <video controls width="100%">
                <source src={preview} type={file?.type} />
                Your browser does not support video.
              </video>
            ) : (
              <img src={preview} alt="Preview" className="rounded-lg border" />
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default GKUpdateService;
