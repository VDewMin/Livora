import React, { useState } from "react";

function ServiceRequestForm() {
  const [formData, setFormData] = useState({
    roomId: "",
    contactNo: "",
    serviceType: "",
    description: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Send formData to backend API here
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-5">Service Request</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col gap-4 mb-4">
          <label>Room ID</label>
          <input
            type="text"
            placeholder="Room ID"
            value={formData.roomId}
            onChange={handleChange}
            className="border-2 border-yellow-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <label>Contact no</label>
          <input
            type="text"
            placeholder="Contact No"
            value={formData.contactNo}
            onChange={handleChange}
            className="border-2 border-yellow-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <label>Service Type</label>
          <select
            value={formData.serviceType}
            onChange={handleChange}
            className="border-2 border-yellow-100 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <label>Description</label>
        <div className="mb-4">
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border-2 border-yellow-100 p-2 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        <div className="mb-4">
          <label className="font-bold mb-2 inline-block">Upload Image or Video</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="border-2 border-yellow-100 p-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-100 font-bold py-2 px-4 rounded hover:bg-yellow-200 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default ServiceRequestForm;
