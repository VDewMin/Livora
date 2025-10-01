import { useState } from "react";
import toast from "react-hot-toast"
import axiosInstance from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const nameRegex = /^[A-Za-z]+$/;
const emailRegex = /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const phoneRegex = /^\d{10}$/;
const apartmentRegex = /^[PR](?:[1-8]0[1-6]|0[1-6])$/;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
    role: "Resident",
    apartmentNo: "",
    residentType: "Tenant",
    staffType: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    apartmentNo: "",
  });

  const [loading, setLoading] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstName" || name === "lastName") {

      if (value === "" || nameRegex.test(value)) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setFormData((prev) => ({ ...prev, [name]: value }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: "Letters only. No numbers or special characters."
        }));
      }
      return;
    }

    if (name === "email") {
      const normalized = value.trim().toLowerCase();
      setFormData((prev) => ({ ...prev, email: normalized }));
      setErrors((prev) => ({
        ...prev,
        email:
          normalized === "" || emailRegex.test(normalized)
            ? ""
            : "Enter a valid email (no spaces or consecutive dots).",
      }));
      return;
    }

    if (name === "phoneNo") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 10);

      setFormData((prev) => ({ ...prev, phoneNo: onlyDigits }));
      setErrors((prev) => ({
        ...prev,
        phoneNo:
          onlyDigits === "" || phoneRegex.test(onlyDigits)
            ? ""
            : "Enter exactly 10 digits.",
      }));
      return;
    }

    if (name === "apartmentNo") {
      const normalized = value.trim().toUpperCase();
      setFormData(prev => ({ ...prev, apartmentNo: normalized }));
      setErrors(prev => ({
        ...prev,
        apartmentNo:
          normalized === "" || apartmentRegex.test(normalized)
            ? ""
            : "Format: P/R + [1-8]01–06 (e.g., P201) or P/R + 01–06 (e.g., P06)."
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);

    setLoading(true);

    if (!nameRegex.test(formData.firstName) || !nameRegex.test(formData.lastName)) {
      toast.error("Names must contain letters only.");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!phoneRegex.test(formData.phoneNo)) {
      toast.error("Phone number must be exactly 10 digits.");
      setLoading(false);
      return;
    }

    if (!apartmentRegex.test(formData.apartmentNo)) {
      toast.error("Apartment No must be like P201, P304, or P06.");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post(
        "/users",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Saved user:", res.data);
      toast.success("User registered successfully!");

      if (formData.role === "Resident") {
        navigate("/admin/residentlist");
      } else if (formData.role === "Staff") {
        navigate("/admin/stafflist");
      }

    } catch (error) {
      console.error("Error registering user:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally{
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Register</h2>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Create your account to access the resident portal. Please fill in all required information accurately.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
            {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
            {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNo"
              placeholder="Enter your phone number"
              value={formData.phoneNo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Register as
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
            >
              <option value="Resident">Resident</option>
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {formData.role === "Resident" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apartment No
                </label>
                <input
                  type="text"
                  name="apartmentNo"
                  placeholder="Enter apartment number"
                  value={formData.apartmentNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resident Type
                </label>
                <select
                  name="residentType"
                  value={formData.residentType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                >
                  <option value="Owner">Owner</option>
                  <option value="Tenant">Tenant</option>
                </select>
              </div>
            </>
          )}

          {formData.role === "Staff" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Staff Type
              </label>
              <select
                name="staffType"
                value={formData.staffType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                required
              >
                <option value="">Select Staff Type</option>
                <option value="Manager">Manager</option>
                <option value="Security">Security</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium text-base mt-8"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
