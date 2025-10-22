import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/vd_AuthContext";
import { Shield, Loader2 } from "lucide-react";
import loginBg from "../assets/LoginPage.jpg";

const VerifyOtp = () => {
    const { userId } = useParams();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleVerify = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("Please enter a 6-digit OTP");
            return;
        }

        setLoading(true);

        try {
            const res = await axiosInstance.post("/users/verify-otp", { userId, otp });
            const { token, user } = res.data;

            login(user, token);
            toast.success("Login successful");
            navigate(`/profile/${user._id}`);

        } catch (err) {
            toast.error(err.response?.data?.message || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Only allow digits
        if (value.length <= 6) {
            setOtp(value);
        }
    };

    return (
        <div
            className="h-screen w-screen flex items-center justify-center fixed inset-0 overflow-hidden"
            style={{
                backgroundImage: `url(${loginBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="w-full max-w-md px-4">
                {/* Welcome Message */}
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-semibold text-white mb-2 drop-shadow-lg">Verify Your Identity</h1>
                    <p className="text-white drop-shadow">Enter the 6-digit code sent to your device</p>
                </div>

                {/* Form Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6">
                    <form onSubmit={handleVerify}>
                        {/* Title */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900">Enter OTP</h2>
                        </div>

                        <p className="text-gray-600 mb-4">
                            We've sent a verification code to your registered device. Please enter it below to continue.
                        </p>

                        {/* OTP Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                6-Digit Code
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                    required
                                    maxLength={6}
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500 text-center">
                                Enter the 6-digit code from your authenticator app
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify OTP"
                            )}
                        </button>

                        {/* Help Text */}
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">
                                Didn't receive the code?{" "}
                                <button
                                    type="button"
                                    onClick={() => toast.info("Resend feature coming soon")}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Resend
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;