import React from "react";

const Success = () => {
  const payment = JSON.parse(localStorage.getItem("payment"));
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">✅ Payment Successful</h2>
        <p className="text-gray-700">Payment ID: <span className="font-semibold">{payment?.paymentId}</span></p>
        <p className="text-gray-700">Amount Paid: <span className="font-semibold">{payment?.totalAmount} LKR</span></p>
      </div>
    </div>
  );
};

export default Success;
