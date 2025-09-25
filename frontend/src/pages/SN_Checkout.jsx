import React, { useState } from "react";
import toast from "react-hot-toast";

const Checkout = () => {
  const [email, setEmail] = useState("");
  const [residentId, setResidentId] = useState("");
  const [apartmentNo, setApartmentNo] = useState("");
  const [residentName, setResidentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amountRent, setAmountRent] = useState(0);
  const [amountLaundry, setAmountLaundry] = useState(0);

  const handleCheckout = async () => {
    if (!email || !residentId || !apartmentNo || !residentName || !phoneNumber) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          residentId,
          apartmentNo,
          residentName,
          phoneNumber,
          amountRent: Number(amountRent),
          amountLaundry: Number(amountLaundry),
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Checkout failed");
        return;
      }

      localStorage.setItem("paymentId", data.parentPayment.paymentId);
      localStorage.setItem("email", email);

      toast.success("Redirecting to payment...");
      window.location.href = data.sessionUrl;
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 relative">
      {/* Navigate to Payment History */}
      <button
        onClick={() => (window.location.href = "/payment-history")}
        className="absolute top-3 right-3 bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 text-sm"
      >
        View Payment History
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        placeholder="Resident ID"
        value={residentId}
        onChange={(e) => setResidentId(e.target.value)}
        className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        placeholder="Apartment No"
        value={apartmentNo}
        onChange={(e) => setApartmentNo(e.target.value)}
        className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        placeholder="Resident Name"
        value={residentName}
        onChange={(e) => setResidentName(e.target.value)}
        className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        placeholder="Rent Amount"
        type="number"
        value={amountRent}
        onChange={(e) => setAmountRent(e.target.value)}
        className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        placeholder="Laundry Amount"
        type="number"
        value={amountLaundry}
        onChange={(e) => setAmountLaundry(e.target.value)}
        className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleCheckout}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors mb-4"
      >
        Proceed to Stripe Checkout
      </button>

      <button
        onClick={() => (window.location.href = "/offline-slip")}
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
      >
        Pay Offline (Upload Slip)
      </button>
    </div>
  );
};

export default Checkout;
