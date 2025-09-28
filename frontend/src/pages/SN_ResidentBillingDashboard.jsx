import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/vd_sidebar";
import toast from "react-hot-toast";
import { useAuth } from "../context/vd_AuthContext";
import axiosInstance from "../lib/axios";
import SN_PaymentDetail from "../components/SN_PaymentDetail";

const SN_ResidentBillingDashboard = () => {
  const [activeItem, setActiveItem] = useState("billing");
  const [activeTab, setActiveTab] = useState("overview");
  const [charges, setCharges] = useState({ rent: 0, laundry: 0, others: 0, total: 0 });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const navigate = useNavigate();
  const { token, user: authUser } = useAuth();

  const userId = sessionStorage.getItem("userId") || authUser?._id;

  // Fetch user info
  const fetchUser = async () => {
    if (!userId) {
      toast.error("User not logged in! Please login first.");
      return;
    }
    try {
      const res = await axiosInstance.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Unable to fetch user details");
    }
  };

  // Fetch charges (replace with API later)
  const fetchCharges = async () => {
    try {
      const rent = 500;
      const laundry = 100;
      const others = 0;
      setCharges({
        rent,
        laundry,
        others,
        total: rent + laundry + others,
      });
    } catch (err) {
      console.error("Error fetching charges:", err);
    }
  };

  const fetchPaymentHistory = async () => {
    if (!userId) return;
    try {
      const res = await axiosInstance.get(`/payments/resident/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // ✅ Ensure paymentType is included
      const payments = Array.isArray(res.data)
        ? res.data.map((p) => ({ ...p, paymentType: p.paymentType || p.type || "Online" }))
        : [];
      setPaymentHistory(payments);
      console.log("Payment history:", payments); // debug
    } catch (err) {
      console.error("Error fetching payment history:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCharges();
    fetchPaymentHistory();
  }, [userId]);

  // Stripe checkout
  const handleStripeCheckout = async () => {
    if (!user || !user._id || !user.phoneNo || !user.email) {
      toast.error("Resident information missing!");
      return;
    }
    try {
      setLoadingPayment(true);
      const res = await axiosInstance.post(
        "/payments/checkout",
        {
          residentId: user._id,
          apartmentNo: user.apartmentNo,
          residentName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          phoneNumber: user.phoneNo,
          amountRent: Number(charges.rent),
          amountLaundry: Number(charges.laundry),
          email: user.email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoadingPayment(false);
      toast.success(res.data.message || "Payment created. Redirecting to Stripe...");
      if (res.data.sessionUrl) window.location.href = res.data.sessionUrl;
    } catch (err) {
      setLoadingPayment(false);
      console.error("Checkout error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Checkout failed");
    }
  };

  const handleOfflinePayment = () => navigate("/offline-slip");

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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        {userId ? "Loading user data..." : "Please login to view billing dashboard"}
      </div>
    );
  }

  // ✅ Pass user to PaymentDetail
  if (selectedPaymentId) {
    return (
      <SN_PaymentDetail
        paymentId={selectedPaymentId}
        user={user}
        goBack={() => setSelectedPaymentId(null)}
        onRemovePayment={(removedId) => {
          setPaymentHistory((prev) => prev.filter((p) => p.paymentId !== removedId));
          fetchPaymentHistory();
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">My Billing</h1>

        {/* Tabs */}
        <div className="flex justify-start items-center mb-6 border-b">
          {["overview", "history", "receipts"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 px-2 font-medium capitalize ${
                activeTab === tab
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "history" ? "Payment History" : tab}
            </button>
          ))}
        </div>

        {/* Overview */}
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
                  loadingPayment
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
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
                    {/* ✅ Added Payment Type */}
                    <th className="border p-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((p) => (
                    <tr
                      key={p._id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedPaymentId(p.paymentId)}
                    >
                      <td className="border px-4 py-2">{p.paymentId}</td>
                      <td className="border px-4 py-2">
                        {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="border px-4 py-2 font-semibold">
                        Rs. {Number(p.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">
                        <span
                          className={
                            p.status === "Completed" ? "text-green-600" : "text-yellow-600"
                          }
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="border px-4 py-2">{p.paymentType || "Online"}</td>
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

// Info Card
const InfoCard = ({ title, value, highlight }) => (
  <div className="bg-white p-6 rounded-2xl shadow text-center">
    <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
    <p className={`text-2xl font-bold ${highlight ? "text-green-600" : "text-gray-900"}`}>
      Rs. {value.toLocaleString()}
    </p>
  </div>
);

export default SN_ResidentBillingDashboard;
