import React, { useEffect, useState } from "react";

const PaymentDetail = ({ paymentId, goBack, onUpdatePayment }) => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null); // Fullscreen image
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!paymentId) return;

    const fetchPayment = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/payments/${paymentId}`);
        if (!res.ok) throw new Error("Payment not found");
        const data = await res.json();
        setPaymentData(data);
      } catch (err) {
        console.error("Error fetching payment:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId]);

  const handleVerify = async () => {
    if (!paymentId) return;
    setVerifying(true);
    try {
      const res = await fetch("http://localhost:5001/api/payments/verify-offline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });

      if (!res.ok) throw new Error("Verification failed");
      const data = await res.json();

      // Update local state
      setPaymentData(prev => ({
        ...prev,
        payment: data.offlinePayment,
      }));

      // Notify parent list to update PaymentHistory
      if (onUpdatePayment) onUpdatePayment(data.offlinePayment);

      alert("Payment verified successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to verify payment");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!paymentData) return <p className="text-center mt-10">Payment not found</p>;

  const { type, payment } = paymentData;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 relative">
      <h2 className="text-2xl font-bold mb-4">{type} Payment Details</h2>

      <button
        onClick={goBack}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mb-6"
      >
        ⬅ Back to Payment History
      </button>

      <table className="w-full border-collapse">
        <tbody>
          <tr>
            <td className="border px-3 py-2 font-semibold">Payment ID</td>
            <td className="border px-3 py-2">{payment.paymentId}</td>
          </tr>
          <tr>
            <td className="border px-3 py-2 font-semibold">Resident ID</td>
            <td className="border px-3 py-2">{payment.residentId}</td>
          </tr>
          <tr>
            <td className="border px-3 py-2 font-semibold">Phone Number</td>
            <td className="border px-3 py-2">{payment.phoneNumber}</td>
          </tr>
          <tr>
            <td className="border px-3 py-2 font-semibold">Total Amount</td>
            <td className="border px-3 py-2">Rs. {payment.totalAmount}</td>
          </tr>
          <tr>
            <td className="border px-3 py-2 font-semibold">Status</td>
            <td className={`border px-3 py-2 ${payment.status === "Completed" ? "text-green-600" : "text-yellow-600"}`}>
              {payment.status}
            </td>
          </tr>
          <tr>
            <td className="border px-3 py-2 font-semibold">Payment Date</td>
            <td className="border px-3 py-2">{new Date(payment.paymentDate).toLocaleString()}</td>
          </tr>

          {/* Online Payment Details */}
          {type === "Online" && (
            <>
              <tr>
                <td className="border px-3 py-2 font-semibold">Amount Rent</td>
                <td className="border px-3 py-2">{payment.amountRent}</td>
              </tr>
              <tr>
                <td className="border px-3 py-2 font-semibold">Amount Laundry</td>
                <td className="border px-3 py-2">{payment.amountLaundry}</td>
              </tr>
              <tr>
                <td className="border px-3 py-2 font-semibold">Transaction ID</td>
                <td className="border px-3 py-2">{payment.transactionId}</td>
              </tr>
            </>
          )}

          {/* Offline Payment Details */}
          {type === "Offline" && (
            <>
              <tr>
                <td className="border px-3 py-2 font-semibold">Amount Rent</td>
                <td className="border px-3 py-2">{payment.amountRent}</td>
              </tr>
              <tr>
                <td className="border px-3 py-2 font-semibold">Amount Laundry</td>
                <td className="border px-3 py-2">{payment.amountLaundry}</td>
              </tr>
              <tr>
                <td className="border px-3 py-2 font-semibold">Verified</td>
                <td className="border px-3 py-2">{payment.verified ? "Yes" : "No"}</td>
              </tr>

              {payment.slipFile && payment.slipFile.data && (
                <tr>
                  <td className="border px-3 py-2 font-semibold">Slip File</td>
                  <td className="border px-3 py-2">
                    <img
                      src={`data:${payment.slipFile.contentType};base64,${payment.slipFile.data}`}
                      alt="Payment Slip"
                      className="max-w-xs border cursor-pointer hover:opacity-80"
                      onClick={() => setModalImage(`data:${payment.slipFile.contentType};base64,${payment.slipFile.data}`)}
                    />
                  </td>
                </tr>
              )}

              {!payment.verified && (
                <tr>
                  <td colSpan={2} className="text-center mt-4">
                    <button
                      onClick={handleVerify}
                      disabled={verifying}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      {verifying ? "Verifying..." : "Verify Payment"}
                    </button>
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>

      {/* Fullscreen Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Full Slip"
            className="max-h-full max-w-full shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default PaymentDetail;
