import React, { useEffect, useState } from "react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Payment History</h2>
        <button
          onClick={() => (window.location.href = "/checkout")}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          ⬅ Back to Checkout
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : payments.length === 0 ? (
        <p className="text-center">No payment records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Payment ID</th>
                <th className="border px-3 py-2">Resident ID</th>
                <th className="border px-3 py-2">Phone</th>
                <th className="border px-3 py-2">Amount</th>
                <th className="border px-3 py-2">Type</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="border px-3 py-2">{p.paymentId}</td>
                  <td className="border px-3 py-2">{p.residentId}</td>
                  <td className="border px-3 py-2">{p.phoneNumber}</td>
                  <td className="border px-3 py-2">Rs.{p.totalAmount}</td>
                  <td className="border px-3 py-2">{p.paymentType}</td>
                  <td
                    className={`border px-3 py-2 ${
                      p.status === "Completed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {p.status}
                  </td>
                  <td className="border px-3 py-2">
                    {new Date(p.paymentDate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
