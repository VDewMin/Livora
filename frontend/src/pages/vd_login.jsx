import { useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/vd_AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend
      const res = await axiosInstance.post("/users/login", formData, {
        headers: {"Content-Type": "application/json"},
      });
      
      navigate(`/verify-otp/${res.data.userId}`);

      toast.success("OTP sent to your email");
      
    } catch (err) {
        console.error("Login failed:", err.response?.data || err);
        toast.error(err.response?.data?.message || "Invalid email or password");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

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
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-6 p-2 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Login
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-gray-600 hover:text-green-600 transition-colors underline"
          >
            Forgot password?
          </button>
        </div>
      </form>
    </div>
  );
}