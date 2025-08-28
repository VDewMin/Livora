import React, { useEffect, useState } from "react";
import axios from "axios";

function ResidentServiceRequests({ roomId }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [aptNo, setAptNo] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // store file object
  const [preview, setPreview] = useState(null); // preview image/video

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5173/api/services");
      const myRequests = res.data.filter((s) => s.roomId === roomId);
      setServices(myRequests);
    } catch (err) {
      console.error("Error fetching services", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // show preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // simple phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contactNo)) {
      alert("Please enter a valid 10-digit contact number");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("aptNo", aptNo);
      formData.append("roomId", roomId);
      formData.append("contactNo", contactNo);
      formData.append("serviceType", serviceType);
      formData.append("description", description);
      if (file) formData.append("file", file);

      await axios.post("http://localhost:5173/api/services", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form
      setAptNo("");
      setServiceType("");
      setDescription("");
      setContactNo("");
      setFile(null);
      setPreview(null);

      fetchServices(); // refresh list
    } catch (err) {
      console.error("Error submitting request", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Service Requests</h1>

      {/* --- Service Request Form --- */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow mb-6"
      >
        <h2 className="text-lg font-semibold mb-3">Submit New Request</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Apartment Number
          </label>
          <input
            type="text"
            value={aptNo}
            onChange={(e) => setAptNo(e.target.value)}
            required
            className="w-full border p-2 rounded"
            placeholder="Enter apartment number"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Contact Number
          </label>
          <input
            type="tel"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            required
            className="w-full border p-2 rounded"
            placeholder="Enter 10-digit contact number"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Service Type</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Service</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border p-2 rounded"
            placeholder="Describe the issue"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">
            Upload Image/Video
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
          {preview && (
            <div className="mt-3">
              <p className="text-gray-600 mb-1">Preview:</p>
              {file.type.startsWith("image/") ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-40 h-40 object-cover rounded"
                />
              ) : (
                <video src={preview} controls className="w-60 rounded" />
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default ResidentServiceRequests;
