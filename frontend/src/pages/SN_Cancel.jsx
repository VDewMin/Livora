import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const reason = localStorage.getItem("reason") || "Payment was cancelled.";
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/resident/billing");
    }, 2500); 

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-red-700 mb-4">❌ Payment Failed</h2>
        <p className="text-gray-700">{reason}</p>
        <p className="mt-4 text-gray-500 text-sm">Redirecting to dashboard in few seconds...</p>
      </div>
    </div>
  );
};

export default Cancel;
