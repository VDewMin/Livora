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

  // Convert file buffer from backend to Base64 for preview
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

  // Fetch existing service details
  useEffect(() => {
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
        if (fileUrl) setPreview(getFileSrc(fileUrl));
      } catch (err) {
        console.error("Error fetching service:", err);
        toast.error("Failed to load service details");
      }
    };

    fetchService();
  }, [id, navigate]);

  // validation
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "contactNo") {
      const onlyDigits = /^\d*$/;
      if (!onlyDigits.test(value)) {
        setErrors({ ...errors, contactNo: "Only numbers are allowed" });
        return;
      } else if (value.length > 10) {
        setErrors({ ...errors, contactNo: "Contact number must be 10 digits" });
        return;
      } else {
        setErrors({ ...errors, contactNo: "" });
      }
      setFormData({ ...formData, contactNo: value });
      return;
    }

    if (name === "contactEmail") {
      setFormData({ ...formData, contactEmail: value });
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors({ ...errors, contactEmail: "Enter a valid email address" });
      } else {
        setErrors({ ...errors, contactEmail: "" });
      }
      return;
    }

    if (name === "fileUrl") {
      if (files && files[0]) {
        const selectedFile = files[0];
        const fileType = selectedFile.type.toLowerCase();
        const validTypes = ["image/png", "image/jpeg", "image/jpg"];

        if (!validTypes.includes(fileType)) {
          toast.error("Only PNG and JPG images are allowed!");
          e.target.value = null;
          setFile(null);
          setPreview(null);
          return;
        }

        if (selectedFile.size > 2 * 1024 * 1024) {
          toast.error("File size must be less than 2MB!");
          e.target.value = null;
          setFile(null);
          setPreview(null);
          return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  //Submit updated service
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Field validation before submit
    if (formData.contactNo.length !== 10) {
      toast.error("Contact number must be exactly 10 digits!");
      return;
    }

    if (errors.contactEmail) {
      toast.error("Please enter a valid email address!");
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
      form.append("contactNo", formData.contactNo);
      form.append("contactEmail", formData.contactEmail);
      form.append("serviceType", formData.serviceType);
      form.append("description", formData.description);

      if (file) form.append("fileUrl", file);

      await axios.put(`http://localhost:5001/api/services/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Service updated successfully!", { position: "top-center" });
      navigate("/resident/user-view");
    } catch (err) {
      console.error("Error updating service:", err);
      toast.error(err.response?.data?.message || "Failed to update service");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl p-6 mt-10 shadow-md font-poppins">
      <h2 className="text-xl font-bold mb-4 text-center">Update Service</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Apartment Number</label>
            <input
              type="text"
              name="aptNo"
              value={formData.aptNo}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Service ID</label>
            <input
              type="text"
              name="serviceId"
              value={formData.serviceId}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <label className="block font-semibold mb-1">Contact Number</label>
        <input
          type="text"
          name="contactNo"
          value={formData.contactNo}
          onChange={handleChange}
          maxLength={10}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.contactNo && <p className="text-red-600 text-sm">{errors.contactNo}</p>}
        <label className="block font-semibold mb-1">Contact Email</label>
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.contactEmail && <p className="text-red-600 text-sm">{errors.contactEmail}</p>}

        <label className="block font-semibold mb-1">Service Type</label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select Service Type --</option>
          <option value="Electrical">Electrical</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Other">Other</option>
        </select>

        <label className="block font-semibold mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <div>
          <label className="block font-semibold mb-1">Upload PNG/JPG Image</label>
          <input
            type="file"
            name="fileUrl"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {preview && (
          <div className="mt-4">
            <p className="font-semibold text-sm mb-1">Image Preview:</p>
            <img src={preview} alt="Preview" className="rounded-lg border" />
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
