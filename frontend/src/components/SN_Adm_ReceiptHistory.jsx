import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5001/api";

const SN_Adm_ReceiptHistory = ({ selectedMonth, onViewReceipt }) => {
  const [receipts, setReceipts] = useState([]);

  const fetchReceipts = async () => {
    try {
      const res = await fetch(
        `${API_URL}/payments?month=${selectedMonth.month}&year=${selectedMonth.year}`
      );
      const data = await res.json();
      // Filter only completed payments
      const completed = (Array.isArray(data) ? data : []).filter(
        (p) => p.status === "Completed"
      );
      setReceipts(completed);
    } catch (err) {
      console.error("Error fetching receipts:", err);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [selectedMonth]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Receipt History
      </h2>

      {receipts.length > 0 ? (
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 w-[12%]">Receipt ID</th>
              <th className="border p-2 w-[20%]">Resident Name</th>
              <th className="border p-2 w-[12%]">Apartment No</th>
              <th className="border p-2 w-[15%]">Payment Type</th>
              <th className="border p-2 w-[15%]">Date</th>
              <th className="border p-2 w-[15%]">Amount</th>
              <th className="border p-2 w-[10%] text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((r) => (
              <tr
                key={r.paymentId || r._id}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="border px-3 py-2">{r.paymentId || "—"}</td>
                <td className="border px-3 py-2">{r.residentName || "—"}</td>
                <td className="border px-3 py-2">{r.apartmentNo || "—"}</td>
                <td className="border px-3 py-2">{r.paymentType || "—"}</td>
                <td className="border px-3 py-2">
                  {r.paymentDate
                    ? new Date(r.paymentDate).toLocaleDateString()
                    : "—"}
                </td>
                <td className="border px-3 py-2 font-semibold text-green-600">
                  Rs. {Number(r.totalAmount || 0).toLocaleString()}
                </td>
                <td className="border px-3 py-2 text-center">
                  <button
                    onClick={() => onViewReceipt(r.paymentId)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center">No receipts found</p>
      )}
    </div>
  );
};

export default SN_Adm_ReceiptHistory;
