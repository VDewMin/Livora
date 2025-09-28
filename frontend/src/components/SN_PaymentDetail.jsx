import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SN_PaymentDetail = ({ paymentId, goBack, onRemovePayment, user }) => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/payments/payment/${paymentId}`);
        const data = await res.json();
        setPayment(data.payment ? { ...data.payment, paymentType: data.type } : null);
      } catch (err) {
        console.error("Error fetching payment detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [paymentId]);

  const handleAction = async (action) => {
    if (!window.confirm(`Are you sure you want to ${action} this payment?`)) return;

    try {
      setActionLoading(true);
      const endpoint = action === "verify" ? "verify-offline" : "reject-offline";

      const res = await fetch(`http://localhost:5001/api/payments/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });

      if (!res.ok) throw new Error(`Failed to ${action} payment`);
      await res.json();

      toast.success(`Payment ${action === "verify" ? "verified" : "rejected"} successfully!`);
      if (onRemovePayment) onRemovePayment(paymentId);
      goBack();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} payment`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading payment details...</p>;
  if (!payment) return <p className="text-center text-red-500">Payment not found.</p>;

  const showAdminActions =
    payment.paymentType === "Offline" && payment.status === "Pending";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ---------------- Sidebar (Your original sidebar code here) ---------------- */}
      <div className="w-64">
        {/* Replace this with your actual sidebar component */}
        {user && user.role && (
          <div className="p-4 shadow-lg h-screen sticky top-0 overflow-y-auto">
            {/* Your sidebar items */}
            <p className="font-bold mb-4">Sidebar</p>
          </div>
        )}
      </div>

      {/* ---------------- Main Content ---------------- */}
      <div className="flex-1 p-6 overflow-y-auto">
        <button
          onClick={goBack}
          className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          &larr; Back
        </button>

        <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Payment Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Payment ID" value={payment.paymentId} />
            <Field label="Payment Type" value={payment.paymentType} />
            <Field label="Apartment No" value={payment.apartmentNo} />
            <Field label="Resident Name" value={payment.residentName} />
            <Field label="Phone Number" value={payment.phoneNumber} />
            <Field
              label="Status"
              value={payment.status}
              className={`${
                payment.status === "Completed"
                  ? "text-green-600 font-semibold"
                  : payment.status === "Failed"
                  ? "text-red-600 font-semibold"
                  : "text-yellow-600 font-semibold"
              }`}
            />
            <Field
              label="Payment Date"
              value={new Date(payment.paymentDate).toLocaleString()}
            />
            <Field label="Total Amount" value={`Rs. ${payment.totalAmount}`} />

            {payment.amountRent !== undefined && (
              <Field label="Rent Amount" value={`Rs. ${payment.amountRent}`} />
            )}
            {payment.amountLaundry !== undefined && (
              <Field label="Laundry Amount" value={`Rs. ${payment.amountLaundry}`} />
            )}

            {payment.transactionId && (
              <Field
                label="Transaction ID"
                value={payment.transactionId}
                className="col-span-2"
              />
            )}
          </div>

          {payment.slipFile?.data && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Slip
              </label>
              <img
                src={`data:${payment.slipFile.contentType};base64,${payment.slipFile.data}`}
                alt="Slip"
                className="max-w-sm border rounded-lg shadow-lg cursor-pointer hover:scale-105 transition"
                onClick={() => setIsImageOpen(true)}
              />
            </div>
          )}

          {/* ---------------- Verify / Reject Buttons (Offline Pending Only) ---------------- */}
          {showAdminActions && (
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => handleAction("verify")}
                disabled={actionLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Verify Payment"}
              </button>
              <button
                onClick={() => handleAction("reject")}
                disabled={actionLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Reject Payment"}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isImageOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsImageOpen(false)}
        >
          <img
            src={`data:${payment.slipFile.contentType};base64,${payment.slipFile.data}`}
            alt="Slip Fullscreen"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full shadow-md hover:bg-gray-200"
            onClick={() => setIsImageOpen(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      readOnly
      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none cursor-default"
    />
  </div>
);

export default SN_PaymentDetail;
