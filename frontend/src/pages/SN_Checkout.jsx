import React, { useState } from "react";

const Checkout = () => {
  const [email, setEmail] = useState("");
  const [residentId, setResidentId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amountRent, setAmountRent] = useState(0);
  const [amountLaundry, setAmountLaundry] = useState(0);
  const [message, setMessage] = useState("");

  const handleCheckout = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ residentId, phoneNumber, amountRent, amountLaundry, email }),
      });
      const data = await res.json();

      // Save paymentId and email for OTP
      localStorage.setItem("paymentId", data.parentPayment.paymentId);
      localStorage.setItem("email", email);

      // Redirect to Stripe Checkout
      window.location.href = data.sessionUrl;
    } catch (err) {
      console.error(err);
      setMessage("Checkout failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input placeholder="Resident ID" value={residentId} onChange={e => setResidentId(e.target.value)} className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input placeholder="Rent Amount" type="number" value={amountRent} onChange={e => setAmountRent(e.target.value)} className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input placeholder="Laundry Amount" type="number" value={amountLaundry} onChange={e => setAmountLaundry(e.target.value)} className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />

      <button onClick={handleCheckout} className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors mb-4">
        Proceed to Stripe Checkout
      </button>

      {message && <p className="text-center text-gray-700">{message}</p>}
    </div>
  );
};

export default Checkout;
