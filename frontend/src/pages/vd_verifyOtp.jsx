import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/vd_AuthContext";

const VerifyOtp = () => {
    const { userId } = useParams();
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleVerify = async (e) => {
        e.preventDefault();

        try{
            const res = await axiosInstance.post("/users/verify-otp", {userId, otp});
            const { token, user} = res.data;

            login(user, token);
            toast.success("Login successfull");
            navigate(`/profile/${user._id}`);

        } catch(err){
            toast.error(err.response?.data?.message || "OTP verification failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
        <form onSubmit={handleVerify} className="bg-white p-8 rounded-2xl shadow-md w-96">
            <h2 className="text-2xl font-bold text-center mb-6">Enter OTP</h2>
            <input
            type="text"
            name="otp"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full mb-4 p-2 border rounded-lg"
            required
            />
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
            Verify OTP
            </button>
        </form>
        </div>
    );

};

export default VerifyOtp;