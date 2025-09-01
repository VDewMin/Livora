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

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/services/${id}`,formData);
      setFormData(res.data);
    } catch (err) {
      console.error("Error fetching service", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/services/${id}`, formData);
      navigate("/");
    } catch (err) {
      console.error("Error updating service", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Update Service</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="aptNo"
          placeholder="Apartment Number"
          value={formData.aptNo}
          onChange={handleChange}
          readOnly
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="serviceId"
          readOnly
          placeholder="Service ID"
          value={formData.serviceId}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="contactNo"
          placeholder="Contact Number"
          value={formData.contactNo}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <select
          type="text"
          name="serviceType"
          placeholder="Service Type"
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
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="fileUrl"
          placeholder="File URL"
          value={formData.fileUrl}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default GKUpdateService;
