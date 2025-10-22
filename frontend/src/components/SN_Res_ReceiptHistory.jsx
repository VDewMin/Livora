import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/vd_AuthContext";
import axiosInstance from "../lib/axios";
import SN_PaymentDetail from "./SN_PaymentDetail";

const SN_Res_ReceiptHistory = () => {
  const { token, user: authUser } = useAuth();
  const userId = sessionStorage.getItem("userId") || authUser?._id;

  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  // Fetch receipts
  const fetchReceipts = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/payments/resident/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data)
        ? res.data.map((p) => ({ ...p, paymentType: p.paymentType || p.type || "Online" }))
        : [];
      setReceipts(data);
    } catch (err) {
      console.error("Error fetching receipts:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to fetch receipts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [userId]);

  if (selectedPaymentId) {
    return (
      <SN_PaymentDetail
        paymentId={selectedPaymentId}
        goBack={() => setSelectedPaymentId(null)}
        onRemovePayment={(removedId) =>
          setReceipts((prev) => prev.filter((p) => p.paymentId !== removedId))
        }
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-4">Receipt History</h2>
      {loading ? (
        <p>Loading receipts...</p>
      ) : receipts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Payment ID", "Date", "Amount", "Status", "Type", "Action"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {receipts.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.paymentId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    Rs. {Number(p.totalAmount || 0).toLocaleString()}
                  </td>
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
                  <td className="px-6 py-4 text-sm">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                      onClick={() => setSelectedPaymentId(p.paymentId)}
                    >
                      View / Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No receipts available.</p>
      )}
    </div>
  );
};

export default SN_Res_ReceiptHistory;
