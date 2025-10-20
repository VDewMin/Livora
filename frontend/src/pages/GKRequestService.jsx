import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function GKServiceRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    aptNo: "",
    contactNo: "",
    contactEmail: "",
    serviceType: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ contactNo: "" });

  // Load user details after login
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    setFormData((prev) => ({
      ...prev,
      aptNo: storedUser.apartmentNo || "",
      contactNo: storedUser.phoneNo || "",
      contactEmail: storedUser.email || "",
    }));

    if (!storedUser.apartmentNo || !storedUser.email || !storedUser.phoneNo) {
      console.warn("Missing user details in localStorage");
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, files, value } = e.target;

    if (name === "contactNo") {
      const onlyDigits = /^\d*$/;
      if (!onlyDigits.test(value)) {
        toast.error("Only numbers are allowed");
        return;
      } else if (value.length > 10) {
        toast.error("Contact number must be 10 digits");
        return;
      } else {
        setErrors({ ...errors, contactNo: "" });
      }
      setFormData((prev) => ({ ...prev, contactNo: value }));
      return;
    }

    if (name === "fileUrl") {
      if (files && files[0]) {
        const fileType = files[0].type.toLowerCase();
        const validTypes = ["image/png", "image/jpeg", "image/jpg"];

        if (!validTypes.includes(fileType)) {
          toast.error("Only PNG and JPG images are allowed!");
          e.target.value = null;
          setFile(null);
          return;
        }
        setFile(files[0]);
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.contactNo || formData.contactNo.length !== 10) {
      toast.error("Contact number must be exactly 10 digits!");
      return;
    }

    setLoading(true);
    try {
      const requestData = new FormData();
      Object.keys(formData).forEach((key) =>
        requestData.append(key, formData[key])
      );
      if (file) requestData.append("file", file);

      await axios.post("http://localhost:5001/api/services", requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Service request submitted successfully!", {
        position: "top-center",
      });
      navigate("/resident/user-view");

      setFormData((prev) => ({
        ...prev,
        serviceType: "",
        description: "",
      }));
      setFile(null);
    } catch (err) {
      console.error("Error submitting service request:", err);
      toast.error("Failed to submit request. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="mt-0 bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-auto overflow-hidden border border-gray-100 font-sens-serif">
        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 p-3 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🧰 Submit a Service Request
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Let the management team know what needs fixing or attention.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Apartment No*
              </label>
              <input
                type="text"
                name="aptNo"
                value={formData.aptNo}
                readOnly
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Contact Email*
              </label>
              <input
                type="text"
                name="contactEmail"
                value={formData.contactEmail}
                readOnly
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Contact No*
              </label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                required
                maxLength={10}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
              {errors.contactNo && (
                <p className="text-red-500 text-sm mt-1">{errors.contactNo}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Service Type*
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            >
              <option value="">-- Select Service Type --</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Description*
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-2 resize-none focus:ring-2 focus:ring-sky-400 focus:outline-none"
              placeholder="Briefly describe your service issue..."
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Upload PNG/JPG Image (Optional)
            </label>
            <input
              type="file"
              name="fileUrl"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white transition-all ${
              loading
                ? "bg-sky-500 cursor-not-allowed"
                : "bg-sky-600 hover:bg-sky-500 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 text-center border-t">
          Apartment Service Center • We're here to help 🏢
        </div>
      </div>
  );
}

export default GKServiceRequest;
