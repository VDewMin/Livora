import React, { useState } from "react";
import axios from "axios";

function GKServiceRequest() {
  const [formData, setFormData] = useState({
    aptNo: "",
    contactNo: "",
    serviceType: "",
    description: "",
    fileUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Handle input changes
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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contactNo.length !== 10) {
      setErrors({ ...errors, contactNo: "Contact number must be exactly 10 digits" });
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:5001/api/services", formData);
      setMessage("Service request submitted successfully ✅");
      setFormData({
        aptNo: "",
        contactNo: "",
        serviceType: "",
        description: "",
        fileUrl: "",
      });
    } catch (err) {
      console.log("Error submitting service request:", err);
      setMessage("Failed to submit service request ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl p-6 mt-10 shadow-md font-poppins">
      <h2 className="text-xl font-bold mb-6 text-center">Service Request</h2>

      {message && (
        <p
          className={`text-center mb-4 ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Apartment No */}
        <div>
          <label className="block font-semibold mb-1">Apartment No</label>
          <input
            type="text"
            name="aptNo"
            value={formData.aptNo}
            onChange={handleChange}
            required
            className="w-full p-2 border border-black-200 rounded-lg"
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
            required
            className="w-full p-2 border border-black-200 rounded-lg"
          />
          {errors.contactNo && (
            <p className="text-red-600 text-sm">{errors.contactNo}</p>
          )}
        </div>

        {/* Service Type */}
        <div>
          <label className="block font-semibold mb-1">Service Type</label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
            className="w-full p-2 border border-black-200 rounded-lg"
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
            className="w-full p-2 border border-black-200 rounded-lg"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block font-semibold mb-1">Upload Image or Video</label>
          <input
            type="file"
            name="fileUrl"
            onChange={handleChange}
            className="w-full p-2 border border-black-200 rounded-lg"
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
