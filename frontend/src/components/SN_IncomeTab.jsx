import { useEffect, useState } from "react";
import PaymentDetail from "./SN_PaymentDetail";

const API_URL = "http://localhost:5001/api/payments";

export default function SN_IncomeTab({ selectedMonth }) {
  const [payments, setPayments] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const fetchPayments = async () => {
    try {
      const res = await fetch(
        `${API_URL}?month=${selectedMonth.month}&year=${selectedMonth.year}`
      );
      const all = await res.json();
      setPayments(all.filter((p) => p.status === "Completed"));
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [selectedMonth]);

  if (selectedPaymentId) {
    return (
      <PaymentDetail
        paymentId={selectedPaymentId}
        goBack={() => setSelectedPaymentId(null)}
      />
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Income (Completed Payments)
      </h2>
      <table className="border w-full text-sm table-fixed">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 w-[12%]">Payment ID</th>
            <th className="border p-2 w-[10%]">Apartment No</th>
            <th className="border p-2 w-[20%]">Resident Name</th>
            <th className="border p-2 w-[15%]">Amount</th>
            <th className="border p-2 w-[13%]">Type</th>
            <th className="border p-2 w-[15%]">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((pay) => (
            <tr
              key={pay._id}
              className="hover:bg-gray-200 cursor-pointer"
              onClick={() => setSelectedPaymentId(pay.paymentId)}
            >
              <td className="border p-2">{pay.paymentId}</td>
              <td className="border p-2">{pay.apartmentNo}</td>
              <td className="border p-2 truncate">{pay.residentName}</td>
              <td className="border p-2">Rs. {pay.totalAmount}</td>
              <td className="border p-2">{pay.paymentType}</td>
              <td className="border p-2">
                {new Date(pay.paymentDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
