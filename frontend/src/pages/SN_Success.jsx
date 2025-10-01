import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const payment = JSON.parse(localStorage.getItem("payment"));
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/resident/billing"); // adjust the route if needed
    }, 2500); // 10 seconds

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">✅ Payment Successful</h2>
        <p className="text-gray-700">
          Payment ID: <span className="font-semibold">{payment?.paymentId}</span>
        </p>
        <p className="text-gray-700">
          Amount Paid: <span className="font-semibold">{payment?.totalAmount} LKR</span>
        </p>
        <p className="mt-4 text-gray-500 text-sm">Redirecting to dashboard in few seconds...</p>
      </div>
    </div>
  );
};

export default Success;
