import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/vd_AuthContext";
import axiosInstance from "../lib/axios";
import SN_PaymentDetail from "../components/SN_PaymentDetail";

const SN_ResidentBillingDashboard = () => {
  const [activeItem, setActiveItem] = useState("billing");
  const [activeTab, setActiveTab] = useState("overview");
  const [charges, setCharges] = useState({ 
    rent: 1000,   // hardcoded value
    laundry: 100, // hardcoded value
    others: 0,     // always 0
    total: 0       // calculated
  });

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
      if (!userId) return;

      const res = await axiosInstance.get(`/payments/resident/${userId}/charges`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If resident has already paid this month, amounts should be zero
      setCharges({
        rent: res.data.isPaid ? 0 : res.data.rent,
        laundry: res.data.isPaid ? 0 : res.data.laundry,
        others: res.data.isPaid ? 0 : res.data.others,
        total: res.data.isPaid ? 0 : res.data.total,
      });
    } catch (err) {
      console.error("Error fetching charges:", err.response?.data || err);
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
    //fetchCharges();
    fetchPaymentHistory();
  }, [userId]);

  useEffect(() => {
    setCharges((prev) => ({
      ...prev,
      total: prev.rent + prev.laundry + prev.others,
    }));
  }, []);

  

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

  const handleOfflinePayment = () => {
    navigate("/offline-slip", {
      state: {
        residentId: user._id,
        apartmentNo: user.apartmentNo,
        residentName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
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
          <p className="text-gray-600 text-lg">
            {userId ? "Loading user data..." : "Please login to view billing dashboard"}
          </p>
        </div>
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
    <div className="flex-1 h-screen overflow-y-scroll bg-gradient-to-br from-gray-50 to-gray-100" 
         style={{
           scrollbarWidth: 'thin', 
           scrollbarColor: '#cbd5e1 #f1f5f9',
           WebkitScrollbar: {
             width: '8px'
           }
         }}>
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Billing</h1>
              <p className="text-gray-600 mt-1">
                Apartment {user.apartmentNo} • {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Month</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 py-6 min-h-screen">
        {/* Tabs */}
        <div className="flex justify-start items-center mb-8">
          <div className="bg-white rounded-xl shadow-sm p-1 border border-gray-200">
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
              
              <div className="p-8">
                <div className="space-y-6">
                  {/* Billing Items */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-lg font-medium text-gray-800">Monthly Rent</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      Rs. {charges.rent.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-lg font-medium text-gray-800">Monthly Laundry</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      Rs. {charges.laundry.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-lg font-medium text-gray-800">Other Charges</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      Rs. {charges.others.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Total */}
                  <div className="flex items-center justify-between py-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl px-6 border-2 border-green-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                      <span className="text-xl font-bold text-green-800">Total Amount</span>
                    </div>
                    <span className="text-3xl font-bold text-green-700">
                      Rs. {charges.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Choose Payment Method</h3>
                <p className="text-gray-600 mt-1">Select how you'd like to pay your monthly charges</p>
              </div>
              
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Online Payment */}
                  <div className="group cursor-pointer" onClick={handleStripeCheckout}>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-white bg-opacity-20 rounded-xl p-3">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v2h16V6H4zm0 4v8h16v-8H4z"/>
                          </svg>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold opacity-20">01</div>
                        </div>
                      </div>
                      <h4 className="text-2xl font-bold mb-2">Pay Online</h4>
                      <p className="text-green-100 mb-6">
                        Secure payment with Stripe. Instant confirmation and receipt.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {loadingPayment ? "Processing..." : "Pay with Stripe"}
                        </span>
                        <div className="bg-white bg-opacity-20 rounded-full p-2 group-hover:bg-opacity-30 transition-all">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Offline Payment */}
                  <div className="group cursor-pointer" onClick={handleOfflinePayment}>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-white bg-opacity-20 rounded-xl p-3">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                          </svg>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold opacity-20">02</div>
                        </div>
                      </div>
                      <h4 className="text-2xl font-bold mb-2">Upload Slip</h4>
                      <p className="text-blue-100 mb-6">
                        Upload your bank transfer receipt or payment slip for verification.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Upload Payment Slip</span>
                        <div className="bg-white bg-opacity-20 rounded-full p-2 group-hover:bg-opacity-30 transition-all">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status Info */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-start space-x-4">
                <div className="bg-amber-500 rounded-full p-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 mb-1">Payment Information</h4>
                  <p className="text-amber-700 text-sm">
                    Online payments are processed immediately. Offline payments may take 1-2 business days to verify.
                    Please keep your payment receipts for records.
                  </p>
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
              {paymentHistory.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                          Payment ID
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentHistory.map((p) => (
                        <tr
                          key={p._id}
                          className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setSelectedPaymentId(p.paymentId)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {p.paymentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            Rs. {Number(p.totalAmount || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                p.status === "Completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                              {p.paymentType || "Online"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payment history</h3>
                  <p className="text-gray-500">Your payment history will appear here once you make your first payment.</p>
                </div>
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
            
            <div className="p-8">
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default SN_ResidentBillingDashboard;