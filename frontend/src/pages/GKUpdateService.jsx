import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";

function GKUpdateService() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    aptNo: "",
    serviceId: "",
    contactNo: "",
    serviceType: "",
    description: "",
    fileUrl: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchService();
    // eslint-disable-next-line
  }, []);

  const fetchService = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/services/${id}`);
      setFormData(res.data);
    } catch (err) {
      console.error("Error fetching service", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "contactNo") {
      if (!/^\d*$/.test(value)) {
        setErrors({ ...errors, contactNo: "Only numbers are allowed" });
        return;
      } else if (value.length > 10) {
        setErrors({ ...errors, contactNo: "Contact number must be 10 digits" });
        return;
      } else {
        setErrors({ ...errors, contactNo: "" });
      }
    }

    if (name === "fileUrl") {
      setFormData({ ...formData, fileUrl: files[0] });
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
      await axios.put(`http://localhost:5001/api/services/${id}`, formData);
      navigate("/");
    } catch (err) {
      console.error("Error updating service", err);
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
              placeholder="Apartment Number"
              value={formData.aptNo}
              onChange={handleChange}
              readOnly
              className="w-full border border-black-200 px-3 py-2 rounded"
            />
          </div>
          <div className="w-1/2">
            <label className="block font-semibold mb-1">Service ID</label>
            <input
              type="text"
              name="serviceId"
              placeholder="Service ID"
              value={formData.serviceId}
              onChange={handleChange}
              readOnly
              className="w-full border border-black-200 px-3 py-2 rounded"
            />
          </div>
        </div>

        <label className="block font-semibold mb-1">Contact Number</label>
        <input
          type="text"
          name="contactNo"
          placeholder="Contact Number"
          value={formData.contactNo}
          onChange={handleChange}
          className="w-full border border-black-200 px-3 py-2 rounded"
        />
        {errors.contactNo && (
          <p className="text-red-600 text-sm">{errors.contactNo}</p>
        )}

        <label className="block font-semibold mb-1">Service Type</label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="w-full border border-black-200 px-3 py-2 rounded"
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
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-black-200 px-3 py-2 rounded"
        />

        <div>
          <label className="block font-semibold mb-1">Upload Image or Video</label>
          <input
            type="file"
            name="fileUrl"
            onChange={handleChange}
            className="w-full border border-black-200 px-3 py-2 rounded"
          />
        </div>

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
