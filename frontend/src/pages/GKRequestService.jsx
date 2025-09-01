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
    const { name, value } = e.target;

    // Contact No validation (only digits, length 10)
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

    setFormData({ ...formData, [name]: value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submit
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
    <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Submit Service Request</h2>
      {message && (
        <p
          className={`text-center mb-4 ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="aptNo"
          placeholder="Apartment No"
          value={formData.aptNo}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="text"
          name="contactNo"
          placeholder="Contact No"
          value={formData.contactNo}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />
        {errors.contactNo && (
          <p className="text-red-600 text-sm">{errors.contactNo}</p>
        )}

        {/* Service Type Dropdown */}
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        >
          <option value="">-- Select Service Type --</option>
          <option value="Electrical">Electrical</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          name="description"
          placeholder="Describe your issue"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="file"
          name="fileUrl"
          value={formData.fileUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}

export default GKServiceRequest;
