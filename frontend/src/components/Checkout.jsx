import { useState } from "react";
import axios from "axios";

const Checkout = () => {
  const [residentId, setResidentId] = useState("");
  const [amountRent, setAmountRent] = useState("");
  const [amountLaundry, setAmountLaundry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5001/api/checkout", {
        residentId,
        amountRent,
        amountLaundry,
        phoneNumber,
      });

      if (res.data.url) {
        window.location.href = res.data.url; // Redirect to Stripe
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Payment failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Pay Rent + Laundry</h2>

      <input
        type="text"
        placeholder="Resident ID"
        value={residentId}
        onChange={(e) => setResidentId(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        type="number"
        placeholder="Rent (LKR)"
        value={amountRent}
        onChange={(e) => setAmountRent(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        type="number"
        placeholder="Laundry (LKR)"
        value={amountLaundry}
        onChange={(e) => setAmountLaundry(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border p-2 w-full"
      />

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md w-full"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Checkout;
