import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paymentId = searchParams.get("paymentId");
  const email = searchParams.get("email");

  const handleVerify = async () => {
    if (!otp) return toast.error("Please enter OTP first!");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5001/api/payments/validate-otp", {
        email,
        otp,
        paymentId,
      });

      if (res.data.parentPayment?.status === "Completed") {
        toast.success("Payment verified successfully!");
        localStorage.setItem("payment", JSON.stringify(res.data.parentPayment));

        setTimeout(() => navigate("/success"), 1500);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          toast.error("Too many failed attempts. Payment cancelled.");
          localStorage.setItem("reason", "Exceeded OTP attempts");
          setTimeout(() => navigate("/cancel"), 1500);
        } else {
          toast.error(`Invalid OTP. Try again. (${3 - newAttempts} attempts left)`);
        }
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        toast.error("Too many failed attempts. Payment cancelled.");

        try {
          await axios.post("http://localhost:5001/api/payments/validate-otp", {
            email,
            paymentId,
            forceFail: true,
          });
        } catch (err) {
          console.error("Failed to mark payment as Failed:", err.response?.data || err.message);
        }

        localStorage.setItem("reason", "Exceeded OTP attempts");
        setTimeout(() => navigate("/cancel"), 1500);
      } else {
        toast.error(`Invalid OTP. Try again. (${3 - newAttempts} attempts left)`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("http://localhost:5001/api/payments/resend-otp", { email });
      setAttempts(0);
      setOtp("");
      toast.success("New OTP sent!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to resend OTP.");
    }
  };

  if (!paymentId || !email)
    return <p className="text-red-600 text-center mt-10">Invalid access. Go back to Checkout.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Verify OTP</h2>
        <p className="text-center mb-6 text-gray-600">
          An OTP was sent to: <span className="font-semibold">{email}</span>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mb-3"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={handleResend}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
