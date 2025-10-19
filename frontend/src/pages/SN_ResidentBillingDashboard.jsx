import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/vd_AuthContext";
import axiosInstance from "../lib/axios";
import SN_PaymentDetail from "../components/SN_PaymentDetail";

const SN_ResidentBillingDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [charges, setCharges] = useState({ rent: 0, laundry: 0, others: 0, total: 0 });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [loadingCharges, setLoadingCharges] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const { token, user: authUser } = useAuth();
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId") || authUser?._id;

  // Fetch user info
  const fetchUser = async () => {
    if (!userId) return;
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

  // Fetch charges
  const fetchCharges = async () => {
    if (!userId) return;
    try {
      setLoadingCharges(true);
      const res = await axiosInstance.get(`/payments/resident/${userId}/charges`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCharges({
        rent: res.data.isPaid ? 0 : res.data.rent,
        laundry: res.data.isPaid ? 0 : res.data.laundry,
        others: res.data.isPaid ? 0 : res.data.others,
        total: res.data.isPaid ? 0 : res.data.total,
      });
    } catch (err) {
      console.error("Error fetching charges:", err.response?.data || err);
    } finally {
      setLoadingCharges(false);
    }
  };

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    if (!userId) return;
    try {
      setLoadingHistory(true);
      const res = await axiosInstance.get(`/payments/resident/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payments = Array.isArray(res.data)
        ? res.data.map((p) => ({ ...p, paymentType: p.paymentType || p.type || "Online" }))
        : [];
      setPaymentHistory(payments);
    } catch (err) {
      console.error("Error fetching payment history:", err.response?.data || err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCharges();
    fetchPaymentHistory();
  }, [userId]);

  const cleanNumber = (val) => {
    if (!val) return 0;
    return Number(String(val).replace(/[^0-9.-]+/g, "")) || 0;
  };
  // Stripe checkout
  const handleStripeCheckout = async () => {
    if (!user || !user._id || !user.phoneNo || !user.email) return toast.error("Resident information missing!");
    try {
      setLoadingPayment(true);
      const res = await axiosInstance.post(
        "/payments/checkout",
        {
          residentId: user._id,
          apartmentNo: user.apartmentNo,
          residentName: `${user.firstName} ${user.lastName}`.trim(),
          phoneNumber: user.phoneNo,
          amountRent: cleanNumber(charges.rent),
          amountLaundry: cleanNumber(charges.laundry),
          email: user.email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Payment created. Redirecting...");
      if (res.data.sessionUrl) window.location.href = res.data.sessionUrl;
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoadingPayment(false);
    }
  };

  // Offline payment
  const handleOfflinePayment = () => {
    if (!user) return;
    navigate("/offline-slip", {
      state: {
        residentId: user._id,
        apartmentNo: user.apartmentNo,
        residentName: `${user.firstName} ${user.lastName}`.trim(),
        phoneNumber: user.phoneNo,
        amountRent: charges.rent,
        amountLaundry: charges.laundry,
      },
    });
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{userId ? "Loading user data..." : "Please login"}</p>
        </div>
      </div>
    );
  }

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
    <div className="flex-1 h-screen overflow-y-scroll bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            {/*<h1 className="text-3xl font-bold text-gray-900">Monthly Payment</h1>*/}
            <p className="text-gray-600 mt-1">
              Apartment {user.apartmentNo} • {user.firstName} {user.lastName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Month</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 min-h-screen">
        {/* Tabs */}
        <div className="flex mb-8">
          {["overview", "history", "receipts"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-lg font-medium capitalize transition-all duration-200 ${
                activeTab === tab
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "history" ? "Payment History" : tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8 pb-8">
            {/* Billing Summary Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white">Monthly Billing Summary</h2>
                <p className="text-green-100 mt-1">Your charges for this month</p>
              </div>
              <div className="p-8 space-y-6">
                {["rent", "laundry", "others"].map((key) => (
                  <div key={key} className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          key === "rent" ? "bg-blue-500" : key === "laundry" ? "bg-purple-500" : "bg-yellow-500"
                        }`}
                      ></div>
                      <span className="text-lg font-medium text-gray-800">
                        {key === "rent" ? "Monthly Rent" : key === "laundry" ? "Monthly Laundry" : "Other Charges"}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">Rs. {Number(charges[key]).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-6 bg-green-50 rounded-2xl px-6 border-2 border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                    <span className="text-xl font-bold text-green-800">Total Amount</span>
                  </div>
                  <span className="text-3xl font-bold text-green-700">Rs. {Number(charges.total).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Choose Payment Method</h3>
                <p className="text-gray-600 mt-1">Select how you'd like to pay your monthly charges</p>
              </div>
              <div className="p-8 grid md:grid-cols-2 gap-6">
                {/* Online Payment */}
                <div
                  className="group cursor-pointer bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white hover:from-green-600 hover:to-green-700 shadow-lg transition-all duration-300 transform hover:scale-105"
                  onClick={handleStripeCheckout}
                >
                  <h4 className="text-2xl font-bold mb-2">Pay Online</h4>
                  <p className="text-green-100 mb-6">Secure payment with Stripe. Instant confirmation and receipt.</p>
                  <span className="font-medium">{loadingPayment ? "Processing..." : "Pay with Stripe"}</span>
                </div>

                {/* Offline Payment */}
                <div
                  className="group cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all duration-300 transform hover:scale-105"
                  onClick={handleOfflinePayment}
                >
                  <h4 className="text-2xl font-bold mb-2">Upload Slip</h4>
                  <p className="text-blue-100 mb-6">Upload your bank transfer receipt for verification.</p>
                  <span className="font-medium">Upload Payment Slip</span>
                </div>
              </div>

              {/* Payment Info Box */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 mt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-500 rounded-full p-2">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Payment Information</h4>
                    <p className="text-amber-700 text-sm">
                      Online payments are processed immediately. Offline payments may take 1-2 business days to verify. Please keep your payment receipts for records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment History */}
        {activeTab === "history" && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mb-8">
            <div className="px-8 py-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
              <p className="text-gray-600 mt-1">View all your previous payments and transactions</p>
            </div>
            <div className="p-8">
              {loadingHistory ? (
                <p>Loading payment history...</p>
              ) : paymentHistory.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Payment ID", "Date", "Amount", "Status", "Type"].map((h) => (
                          <th
                            key={h}
                            className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentHistory.map((p) => (
                        <tr
                          key={p._id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedPaymentId(p.paymentId)}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.paymentId}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "—"}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">Rs. {Number(p.totalAmount || 0).toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                p.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : p.status === "Failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{p.paymentType || "Online"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500">No payment history available.</p>
              )}
            </div>
          </div>
        )}

        {/* Receipts */}
        {activeTab === "receipts" && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mb-8">
            <div className="px-8 py-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Receipts</h2>
              <p className="text-gray-600 mt-1">Download and manage your payment receipts</p>
            </div>
            <div className="p-8 text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Receipts Coming Soon</h3>
              <p className="text-gray-500 mb-4">
                We're working on bringing you digital receipts for all your payments.
              </p>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Tip:</strong> For now, you can access payment details in your payment history above.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SN_ResidentBillingDashboard;
