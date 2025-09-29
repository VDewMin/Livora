// src/pages/vd_resetPassword.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/vd_AuthContext";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password too short");
    if (password !== confirm) return toast.error("Passwords do not match");

    try {
      await axiosInstance.post("/users/reset-password", { token, password });
      toast.success("Password reset successful — please log in");

      logout();
        
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg"
          required
        />
        <button className="w-full bg-green-600 text-white py-2 rounded-lg">Save Password</button>
      </form>
    </div>
  );
}
