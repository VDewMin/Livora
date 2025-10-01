import { useState } from "react";
import toast from "react-hot-toast"
import axiosInstance from "../lib/axios";

const nameRegex = /^[A-Za-z]+$/; // strict: letters only (no spaces, no symbols)
const emailRegex = /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const phoneRegex = /^\d{10}$/; // exactly 10 numbers
const apartmentRegex = /^[PR](?:[1-8]0[1-6]|0[1-6])$/;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
    role: "Resident", // default
    apartmentNo: "",
    residentType: "Tenant",
    staffType: "",
    //department: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    apartmentNo: "",
  });

  const [loading, setLoading] = useState("");

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
    // optional sanitize: strip non-digits and trim to 10
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
        formData, // <- send the object directly
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Saved user:", res.data);
      toast.success("User registered successfully!");
    } catch (error) {
      console.error("Error registering user:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally{
      setLoading(false);
    }

  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {/* First & Last Name */}
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-lg"
          required
        />
        {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-lg"
          required
        />
        {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}


        {/* Email & Phone */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-lg"
          required
        />

        <input
          type="text"
          name="phoneNo"
          placeholder="Phone Number"
          value={formData.phoneNo}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-lg"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-6 p-2 border rounded-lg"
          required
        />

        {/* Role */}
        <label className="block mb-2 font-semibold">Register as</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-lg"
        >
          <option value="Resident">Resident</option>
          <option value="Staff">Staff</option>
          <option value="Admin">Admin</option>
        </select>

        {/* Conditional Fields */}
        {formData.role === "Resident" && (
          <>
            <input
              type="text"
              name="apartmentNo"
              placeholder="Apartment No"
              value={formData.apartmentNo}
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded-lg"
              required
            />

            <select
              name="residentType"
              value={formData.residentType}
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded-lg"
            >
              <option value="Owner">Owner</option>
              <option value="Tenant">Tenant</option>
            </select>
          </>
        )}

        {formData.role === "Staff" && (
          <>
           {/* <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded-lg"
              required
            /> */}

            <select
              name="staffType"
              value={formData.staffType}
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded-lg"
              required
            >
              <option value="">Select Staff Type</option>
              <option value="Manager">Manager</option>
              <option value="Security">Security</option>
              <option value="Cleaner">Cleaner</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;