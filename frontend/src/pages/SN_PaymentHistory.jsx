import React, { useState, useEffect } from "react";
import PaymentDetail from "./SN_PaymentDetail";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/payments");
        const data = await res.json();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleUpdatePayment = (updatedPayment) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.paymentId === updatedPayment.paymentId
          ? { ...p, status: updatedPayment.status }
          : p
      )
    );
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!payments.length) return <p className="text-center mt-10">No payments found</p>;

  return (
    <div>
      {!selectedPaymentId ? (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4 text-center">Payment History</h2>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Payment ID</th>
                <th className="border px-4 py-2">Resident ID</th>
                <th className="border px-4 py-2">Apartment No</th>
                <th className="border px-4 py-2">Resident Name</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr
                  key={p._id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedPaymentId(p.paymentId)}
                >
                  <td className="border px-4 py-2">{p.paymentId}</td>
                  <td className="border px-4 py-2">{p.residentId}</td>
                  <td className="border px-4 py-2">{p.apartmentNo}</td>
                  <td className="border px-4 py-2">{p.residentName}</td>
                  <td className="border px-4 py-2">{p.phoneNumber}</td>
                  <td className="border px-4 py-2">Rs. {p.totalAmount}</td>
                  <td className="border px-4 py-2">{p.paymentType}</td>
                  <td
                    className={`border px-4 py-2 ${
                      p.status === "Completed"
                        ? "text-green-600"
                        : p.status === "Failed"
                        ? "text-red-600"
                        : p.status === "Rejected"
                        ? "text-gray-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {p.status}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(p.paymentDate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <PaymentDetail
          paymentId={selectedPaymentId}
          goBack={() => setSelectedPaymentId(null)}
          onUpdatePayment={handleUpdatePayment}
        />
      )}
    </div>
  );
};

export default PaymentHistory;
