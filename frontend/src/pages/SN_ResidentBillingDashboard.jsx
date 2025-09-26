// src/pages/SN_ResidentBillingDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/vd_sidebar";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios"; // Optional: for API calls

const SN_ResidentBillingDashboard = () => {
  const [activeItem, setActiveItem] = useState("billing");
  const [activeTab, setActiveTab] = useState("overview");
  const [charges, setCharges] = useState({
    rent: 0,
    laundry: 0,
    others: 0,
    total: 0,
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const navigate = useNavigate();

  // ✅ Get logged-in user from session
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const residentId = user?._id;
  const email = user?.email;
  const apartmentNo = user?.apartmentNo;
  const residentName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const phoneNo = user?.phoneNo;

  // Fetch resident charges (currently dummy values)
  const fetchCharges = async () => {
    try {
      // 🔧 Replace with API call if needed
      setCharges({
        rent: 25000,
        laundry: 1500,
        others: 0,
        total: 25000 + 1500 + 0,
      });
    } catch (err) {
      console.error("Error fetching charges:", err);
    }
  };

  // Fetch resident payment history
  const fetchPaymentHistory = async () => {
    if (!residentId) return;
    try {
      const res = await fetch(`http://localhost:5001/api/payments/${residentId}`);
      const data = await res.json();
      setPaymentHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching payment history:", err);
    }
  };

  useEffect(() => {
    fetchCharges();
    fetchPaymentHistory();
  }, [residentId]);

  // ✅ Stripe Checkout
  const handleStripeCheckout = async () => {
    if (!residentId || !email) {
      toast.error("Resident information missing!");
      return;
    }

    try {
      setLoadingPayment(true);
      const res = await fetch("http://localhost:5001/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          residentId,
          apartmentNo,
          residentName,
          phoneNumber: phoneNo,
          amountRent: Number(charges.rent),
          amountLaundry: Number(charges.laundry),
          email,
        }),
      });

      const data = await res.json();
      setLoadingPayment(false);

      if (!res.ok) return toast.error(data.message || "Checkout failed");

      // Store Stripe session data if needed
      localStorage.setItem("paymentId", data.parentPayment.paymentId);
      localStorage.setItem("email", email);

      toast.success("Redirecting to payment...");
      window.location.href = data.sessionUrl; // Redirect to Stripe checkout
    } catch (err) {
      setLoadingPayment(false);
      console.error(err);
      toast.error("Checkout failed");
    }
  };

  const handleOfflinePayment = () => {
    navigate("/offline-slip");
  };

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    switch (itemId) {
      case "dashboard":
        navigate("/resident/dashboard");
        break;
      case "billing":
        navigate("/resident/billing");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">My Billing</h1>

        {/* Tabs */}
        <div className="flex justify-start items-center mb-6 border-b">
          {["overview", "history", "receipts"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 px-2 font-medium capitalize ${
                activeTab === tab ? "border-b-2 border-green-600 text-green-600" : "text-gray-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "history" ? "Payment History" : tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InfoCard title="Monthly Rent" value={charges.rent} />
              <InfoCard title="Laundry Fee" value={charges.laundry} />
              <InfoCard title="Others" value={charges.others} />
              <InfoCard title="Total" value={charges.total} highlight />
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
              <button
                disabled={loadingPayment}
                onClick={handleStripeCheckout}
                className={`${
                  loadingPayment ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                } text-white font-semibold px-6 py-3 rounded-lg shadow`}
              >
                {loadingPayment ? "Processing..." : "Pay Online (Stripe)"}
              </button>

              <button
                onClick={handleOfflinePayment}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
              >
                Upload Payment Slip
              </button>
            </div>
          </div>
        )}

        {/* Payment History */}
        {activeTab === "history" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">My Payment History</h2>
            {paymentHistory.length > 0 ? (
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Payment ID</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((p) => (
                    <tr key={p._id}>
                      <td className="border px-4 py-2">{p.paymentId}</td>
                      <td className="border px-4 py-2">
                        {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="border px-4 py-2 font-semibold">Rs. {Number(p.totalAmount || 0).toLocaleString()}</td>
                      <td className="border px-4 py-2">
                        <span className={p.status === "Completed" ? "text-green-600" : "text-yellow-600"}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center">No payment history available</p>
            )}
          </div>
        )}

        {/* Receipts */}
        {activeTab === "receipts" && (
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Receipts</h2>
            <p className="text-gray-600">This feature will be available soon. Stay tuned!</p>
          </div>
        )}
      </main>
    </div>
  );
};

// Small Card Component
const InfoCard = ({ title, value, highlight }) => (
  <div className="bg-white p-6 rounded-2xl shadow text-center">
    <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
    <p className={`text-2xl font-bold ${highlight ? "text-green-600" : "text-gray-900"}`}>
      Rs. {value.toLocaleString()}
    </p>
  </div>
);

export default SN_ResidentBillingDashboard;
