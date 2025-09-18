import { useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

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
      //Example response: { token, user: { _id, email, role, ... } }
      const { token, user } = res.data;

      // Save token for authenticated requests
      localStorage.setItem("authToken", token);

      toast.success("Login successfull");

      //Redirect to profile page
      navigate(`/users/${user._id}`);
      
    } catch (err) {
        console.error("Login failed:", err.response?.data || err);
        toast.error(err.response?.data?.message || "Invalid email or password");
    }
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
      </form>
    </div>
  );
}
