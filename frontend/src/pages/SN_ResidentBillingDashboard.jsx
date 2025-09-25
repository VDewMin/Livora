// src/pages/SN_ResidentBillingDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/vd_sidebar";

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
  const navigate = useNavigate();

  // Fetch resident charges (replace with your API)
  const fetchCharges = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/resident/charges");
      const data = await res.json();
      setCharges({
        rent: Number(data.rent || 0),
        laundry: Number(data.laundry || 0),
        others: Number(data.others || 0),
        total: Number(data.rent || 0) + Number(data.laundry || 0) + Number(data.others || 0),
      });
    } catch (err) {
      console.error("Error fetching charges:", err);
    }
  };

  // Fetch resident payment history
  const fetchPaymentHistory = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/resident/payments");
      const data = await res.json();
      setPaymentHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching payment history:", err);
    }
  };

  useEffect(() => {
    fetchCharges();
    fetchPaymentHistory();
  }, []);

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
            {/* Charges Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow text-center">
                <h2 className="text-lg font-semibold text-gray-700">Monthly Rent</h2>
                <p className="text-2xl font-bold text-gray-900">Rs. {charges.rent.toLocaleString()}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow text-center">
                <h2 className="text-lg font-semibold text-gray-700">Laundry Fee</h2>
                <p className="text-2xl font-bold text-gray-900">Rs. {charges.laundry.toLocaleString()}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow text-center">
                <h2 className="text-lg font-semibold text-gray-700">Others</h2>
                <p className="text-2xl font-bold text-gray-900">Rs. {charges.others.toLocaleString()}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow text-center">
                <h2 className="text-lg font-semibold text-gray-700">Total</h2>
                <p className="text-3xl font-bold text-green-600">Rs. {charges.total.toLocaleString()}</p>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
                onClick={() => navigate("/resident/payment/online")}
              >
                Pay Online
              </button>

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow"
                onClick={() => navigate("/resident/payment/offline")}
              >
                Upload Payment Slip
              </button>
            </div>
          </div>
        )}

        {/* Payment History Tab */}
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
                    <tr key={p.paymentId || p._id}>
                      <td className="border px-4 py-2">{p.paymentId || p._id}</td>
                      <td className="border px-4 py-2">
                        {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="border px-4 py-2 font-semibold">Rs. {Number(p.totalAmount || 0).toLocaleString()}</td>
                      <td className="border px-4 py-2">
                        <span
                          className={`font-medium ${
                            p.status === "Completed"
                              ? "text-green-600"
                              : p.status === "Pending"
                              ? "text-yellow-600"
                              : "text-gray-600"
                          }`}
                        >
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

        {/* Receipts Tab */}
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

export default SN_ResidentBillingDashboard;
