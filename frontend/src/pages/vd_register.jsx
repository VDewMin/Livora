import { useState } from "react";
import toast from "react-hot-toast"
import axiosInstance from "../lib/axios";

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

  const [loading, setLoading] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);

    setLoading(true);

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

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-lg"
          required
        />

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