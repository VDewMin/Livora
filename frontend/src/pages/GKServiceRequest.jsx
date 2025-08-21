import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function CreateServiceRequest() {
  const [formData, setFormData] = useState({
    roomId: "",
    contactNo: "",
    serviceType: "",
    description: "",
    fileUrl: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5173/api/services", formData);
      toast.success("Service request created!");
      setFormData({
        roomId: "",
        contactNo: "",
        serviceType: "",
        description: "",
        fileUrl: "",
      });
    } catch (err) {
      toast.error("Failed to create request");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      
      <h2 className="text-xl font-bold mb-4">Create Service Request</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="roomId"
          value={formData.roomId}
          onChange={handleChange}
          placeholder="Room ID"
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="contactNo"
          value={formData.contactNo}
          onChange={handleChange}
          placeholder="Contact Number"
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Service Type</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Electrical">Electrical</option>
          <option value="Cleaning">Cleaning</option>
        </select>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          rows="3"
          required
        />

        <input
          type="file"
          name="fileUrl"
          value={formData.fileUrl}
          onChange={handleChange}
          placeholder="File URL (optional)"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        ><Toaster />
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateServiceRequest;
