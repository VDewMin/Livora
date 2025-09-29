import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router";

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
    fileUrl: "",
  });
  const [file, setFile] = useState(null); // ✅ file state
  const [preview, setPreview] = useState(null); // ✅ preview existing image/video
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchService();
    // eslint-disable-next-line
  }, []);

  const fetchService = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/services/${id}`);

      const { fileUrl, ...otherFields } = res.data;
      setFormData(otherFields);

      // If file exists in DB, create a blob preview
      if (fileUrl?.data) {
        const byteArray = new Uint8Array(fileUrl.data.data);
        const blob = new Blob([byteArray], { type: fileUrl.contentType });
        const url = URL.createObjectURL(blob);
        setPreview(url);
      }
    } catch (err) {
      console.error("Error fetching service", err);
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
      setPreview(URL.createObjectURL(selectedFile)); // ✅ show preview
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

    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });
      if (file) form.append("file", file);

      await axios.put(`http://localhost:5001/api/services/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Update request submitted successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/user-view");
    } catch (err) {
      console.error("Error updating service", err);
      toast.error("Failed to update service", { position: "top-center" });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl p-6 mt-10 shadow-md font-poppins">
      <h2 className="text-xl font-bold mb-4 text-center">Update Service</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Apartment No & Service ID in one row */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Apartment Number</label>
            <input
              type="text"
              name="aptNo"
              value={formData.aptNo}
              readOnly
              className="w-full border border-black-200 px-3 py-2 rounded bg-gray-100"
            />
          </div>

          <div className="w-1/2">
            <label className="block font-semibold mb-1">Service ID</label>
            <input
              type="text"
              name="serviceId"
              value={formData.serviceId}
              readOnly
              className="w-full border border-black-200 px-3 py-2 rounded bg-gray-100"
            />
          </div>
        </div>

       
        <label className="block font-semibold mb-1">Contact Number</label>
        <input
          type="text"
          name="contactNo"
          value={formData.contactNo}
          onChange={handleChange}
          className="w-full border border-black-200 px-3 py-2 rounded bg-gray-100"
        />
        {errors.contactNo && <p className="text-red-600 text-sm">{errors.contactNo}</p>}

        <label className="block font-semibold mb-1">Contact Email</label>
        <input
          type="text"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleChange}
          className="w-full border border-black-200 px-3 py-2 rounded bg-gray-100"
        />
        {errors.contactEmail && <p className="text-red-600 text-sm">{errors.contactEmail}</p>}
        

        <label className="block font-semibold mb-1">Service Type</label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="w-full border border-black-200 px-3 py-2 rounded bg-gray-100"
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
          className="w-full border border-black-200 px-3 py-2 rounded bg-gray-100"
        />

        <div>
          <label className="block font-semibold mb-1">Upload Image or Video</label>
          <input
            type="file"
            name="fileUrl"
            onChange={handleChange}
            className="w-full border border-black-200 px-3 py-2 rounded bg-gray-100"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-4">
            {file?.type?.startsWith("video") || formData.fileUrl?.contentType?.startsWith("video") ? (
              <video controls width="100%">
                <source src={preview} type={file?.type || formData.fileUrl?.contentType} />
                Your browser does not support video.
              </video>
            ) : (
              <img src={preview} alt="Preview" className=" rounded-lg border" />
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
