import React, { useState } from "react";
import axios from "axios";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const paymentId = localStorage.getItem("paymentId");
  const email = localStorage.getItem("email");

  const handleVerify = async () => {
    if (!otp) return alert("Enter OTP");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5001/api/payments/validate-otp", { email, otp, paymentId });

      if (res.data.parentPayment?.status === "Completed") {
        localStorage.setItem("payment", JSON.stringify(res.data.parentPayment));
        window.location.href = "/success";
      } else {
        
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          localStorage.setItem("reason", "Exceeded OTP attempts");
          window.location.href = "/cancel";
        } else {
          alert(`Invalid OTP. Try again. (${3 - newAttempts} attempts left)`);
        }
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        localStorage.setItem("reason", "Exceeded OTP attempts");
        window.location.href = "/cancel";
      } else {
        alert(`Invalid OTP. Try again. (${3 - newAttempts} attempts left)`);
      }
      } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("http://localhost:5001/api/payments/resend-otp", { email });
      alert("OTP resent to your email");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to resend OTP");
    }
  };

  if (!paymentId || !email)
    return <p className="text-red-600 text-center mt-10">Invalid access. Go back to Checkout.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Verify OTP</h2>
        <p className="text-center mb-6 text-gray-600">An OTP was sent to: <span className="font-semibold">{email}</span></p>
        <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button onClick={handleVerify} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mb-3">{loading ? "Verifying..." : "Verify OTP"}</button>
        <button onClick={handleResend} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg">Resend OTP</button>
      </div>
    </div>
  );
};

export default VerifyOTP;
