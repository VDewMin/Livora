// vd_updateUser.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const UpdateUser = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // MongoDB _id from route param

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

  const [loading, setLoading] = useState(true);

  // Fetch user by _id
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/users/${id}`);
        const user = res.data;

        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phoneNo: user.phoneNo || "",
          password: "", // do not pre-fill password
          role: user.role || "Resident",
          apartmentNo: user.apartmentNo || "",
          residentType: user.residentType || "Tenant",
          staffType: user.staffType || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/users/${id}`, formData);
      toast.success("User updated successfully!");

      // Navigate back based on role
      if (formData.role === "Resident") {
        navigate("/admin/residentlist");
      } else if (formData.role === "Staff") {
        navigate("/admin/stafflist");
      } else {
        navigate("/admin/userlist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-600">Loading user data...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Update User</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone No</label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="Resident">Resident</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Resident fields */}
        {formData.role === "Resident" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Apartment No</label>
              <input
                type="text"
                name="apartmentNo"
                value={formData.apartmentNo}
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Resident Type</label>
              <select
                name="residentType"
                value={formData.residentType}
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="Owner">Owner</option>
                <option value="Tenant">Tenant</option>
              </select>
            </div>
          </>
        )}

        {/* Staff fields */}
        {formData.role === "Staff" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Staff Type</label>
            <select
              name="staffType"
              value={formData.staffType}
              onChange={handleChange}
              className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Security">Security</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Manager">Manager</option>
              <option value="Cleaner">Cleaner</option>
            </select>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Update User
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUser;
