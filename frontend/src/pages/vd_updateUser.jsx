import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { Shield, User, Mail, Phone, Lock, Building, Briefcase, AlertCircle, Users } from "lucide-react";

const nameRegex = /^[A-Z][a-z]*(?:\s[A-Z][a-z]*)*$/;
const emailRegex = /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const phoneRegex = /^\d{10}$/;
const apartmentRegex = /^[PQ](?:[1-8]0[1-6]|0[1-6])$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


const UpdateUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    secondaryPhoneNo: "",
    recoveryEmail: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    familyMembers: "",
    medicalConditions: "",
    job: ""
  });

  const formatDateForInput = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  };

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    apartmentNo: "",
    secondaryPhoneNo: "",
    recoveryEmail: "",
    emergencyContactNumber: ""
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
          password: "",
          role: user.role || "Resident",
          apartmentNo: user.apartmentNo || "",
          residentType: user.residentType || "Tenant",
          staffType: user.staffType || "",
          secondaryPhoneNo: user.secondaryPhoneNo || "",
          recoveryEmail: user.recoveryEmail || "",
          dateOfBirth: formatDateForInput(user.dateOfBirth),
          emergencyContactName: user.emergencyContactName || "",
          emergencyContactNumber: user.emergencyContactNumber || "",
          familyMembers: user.familyMembers || "",
          medicalConditions: user.medicalConditions || "",
          job: user.job || ""
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstName" || name === "lastName" || name === "emergencyContactName") {
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

    if (name === "recoveryEmail") {
      const normalized = value.trim().toLowerCase();
      setFormData((prev) => ({ ...prev, recoveryEmail: normalized }));
      setErrors((prev) => ({
        ...prev,
        recoveryEmail:
          normalized === "" || emailRegex.test(normalized)
            ? ""
            : "Enter a valid email (no spaces or consecutive dots).",
      }));
      return;
    }

    if (name === "phoneNo" || name === "secondaryPhoneNo" || name === "emergencyContactNumber") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: onlyDigits }));
      setErrors((prev) => ({
        ...prev,
        [name]:
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
            : "Format: P/Q + [1-8]01–06 (e.g., P201) or P/R + 01–06 (e.g., P06)."
      }));
      return;
    }

     if (name === "password") {
      setFormData((prev) => ({ ...prev, password: value }));
      setErrors((prev) => ({
        ...prev,
        password:
          value === "" || passwordRegex.test(value)
            ? ""
            : "Weak password — must be 8+ chars, include uppercase, lowercase, number & symbol."
      }));
      return;
    }

    if (name === "familyMembers") {
      const number = value.replace(/\D/g, "").slice(0, 2);
      setFormData((prev) => ({ ...prev, familyMembers: number }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdating(true);

    if (!nameRegex.test(formData.firstName) || !nameRegex.test(formData.lastName)) {
      toast.error("Names must contain letters only.");
      setUpdating(false);
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      setUpdating(false);
      return;
    }

    if (!phoneRegex.test(formData.phoneNo)) {
      toast.error("Phone number must be exactly 10 digits.");
      setUpdating(false);
      return;
    }

    if (formData.secondaryPhoneNo && !phoneRegex.test(formData.secondaryPhoneNo)) {
      toast.error("Secondary phone must be exactly 10 digits.");
      setUpdating(false);
      return;
    }

    if (formData.recoveryEmail && !emailRegex.test(formData.recoveryEmail)) {
      toast.error("Please enter a valid recovery email.");
      setUpdating(false);
      return;
    }

    if (formData.emergencyContactNumber && !phoneRegex.test(formData.emergencyContactNumber)) {
      toast.error("Emergency contact must be exactly 10 digits.");
      setUpdating(false);
      return;
    }

    if (formData.role === "Resident") {
      if (!apartmentRegex.test(formData.apartmentNo)) {
        toast.error("Apartment No must be like P201, Q304");
        setUpdating(false);
        return;
      }
    }

    if (formData.password && !passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      setUpdating(false);
      return;
    }

    // ✅ Validate date of birth only before saving
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();

      if (isNaN(dob.getTime())) {
        toast.error("Please enter a valid date of birth.");
        setUpdating(false);
        return;
      }

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      if (age < 18) {
        toast.error("You must be at least 18 years old to register.");
        setUpdating(false);
        return;
      }

      if (age > 100) {
        toast.error("Age cannot be more than 100 years.");
        setUpdating(false);
        return;
      }
    }

    try {

      const payload = { ...formData };
      if (!payload.password) {
        delete payload.password; // prevent overwriting existing password
      }
      
      await axiosInstance.put(`/users/${id}`, formData);
      toast.success("User updated successfully!");

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
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm p-8 my-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Update User</h2>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Update user information. Please ensure all required fields are filled accurately.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
                {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
                {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />

              </div>

              {formData.role === "Resident" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job
                  </label>
                  <input
                    type="text"
                    name="job"
                    placeholder="Enter occupation"
                    value={formData.job}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recovery Email
                </label>
                <input
                  type="email"
                  name="recoveryEmail"
                  placeholder="Enter recovery email"
                  value={formData.recoveryEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                {errors.recoveryEmail && <p className="text-sm text-red-600 mt-1">{errors.recoveryEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phoneNo"
                  placeholder="Enter phone number"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
                {errors.phoneNo && <p className="text-sm text-red-600 mt-1">{errors.phoneNo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Phone
                </label>
                <input
                  type="text"
                  name="secondaryPhoneNo"
                  placeholder="Optional"
                  value={formData.secondaryPhoneNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                {errors.secondaryPhoneNo && <p className="text-sm text-red-600 mt-1">{errors.secondaryPhoneNo}</p>}
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              Emergency Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  placeholder="Enter emergency contact name"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Number
                </label>
                <input
                  type="text"
                  name="emergencyContactNumber"
                  placeholder="Enter emergency contact number"
                  value={formData.emergencyContactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                />
                {errors.emergencyContactNumber && <p className="text-sm text-red-600 mt-1">{errors.emergencyContactNumber}</p>}
              </div>
            </div>
          </div>

          {formData.role === "Resident" && (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Additional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Family Members
                  </label>
                  <input
                    type="number"
                    name="familyMembers"
                    placeholder="Enter number"
                    value={formData.familyMembers}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Conditions
                  </label>
                  <input
                    type="text"
                    name="medicalConditions"
                    placeholder="Optional"
                    value={formData.medicalConditions}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-blue-600" />
              Account Setup
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Leave blank to keep current password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <p className="text-sm text-gray-500 mt-1">Leave blank if you don't want to change the password</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
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
            </div>
          </div>

          {formData.role === "Resident" && (
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Resident Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apartment No *
                  </label>
                  <input
                    type="text"
                    name="apartmentNo"
                    placeholder="Enter apartment number"
                    value={formData.apartmentNo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                    required
                  />
                  {errors.apartmentNo && <p className="text-sm text-red-600 mt-1">{errors.apartmentNo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resident Type *
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
              </div>
            </div>
          )}

          {formData.role === "Staff" && (
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                Staff Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Type *
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
                  <option value="Laundry">Laundry</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={updating}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium text-base disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {updating ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
