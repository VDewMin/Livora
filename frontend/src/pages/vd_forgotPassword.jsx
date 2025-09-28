
import { useState } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/users/forgot-password", { email });
      toast.success("If the email exists, a reset link was sent.");
      // optionally navigate to instruction page:
      // navigate("/forgot-password-sent")
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg"
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Send Reset Link</button>
      </form>
    </div>
  );
}
