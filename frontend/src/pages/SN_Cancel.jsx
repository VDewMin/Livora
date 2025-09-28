import React from "react";

const Cancel = () => {
  const reason = localStorage.getItem("reason") || "Payment was cancelled.";
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-red-700 mb-4">❌ Payment Failed</h2>
      </div>
    </div>
  );
};

export default Cancel;
