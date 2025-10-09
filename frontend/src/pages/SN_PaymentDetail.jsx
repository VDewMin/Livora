import React, { useEffect, useState } from "react";
import SN_IncomeTab from "../components/SN_IncomeTab";
import SN_ExpenseTab from "../components/SN_ExpenseManager";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Package,
  ShoppingCart
} from "lucide-react";

const SN_AdminBillingDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [incomeData, setIncomeData] = useState({ totalPayments: 0, totalExpenses: 0 });
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/payments");
      const data = await res.json();
      setPayments(data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  const fetchIncome = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/calculateIncome");
      if (!res.ok) throw new Error("Income API not found");
      const data = await res.json();
      setIncomeData(data);
    } catch (err) {
      console.error("Error fetching income:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchPayments();
    fetchIncome();
  }, []);

  if (selectedExpenseId) {
    return (
      <ExpenseDetail
        expenseId={selectedExpenseId}
        goBack={() => setSelectedExpenseId(null)}
      />
    );
  }

  if (selectedPaymentId) {
    return (
      <PaymentDetail
        paymentId={selectedPaymentId}
        goBack={() => setSelectedPaymentId(null)}
        onUpdatePayment={(updatedPayment) => {
          setPayments((prev) =>
            prev.map((p) => (p.paymentId === updatedPayment.paymentId ? updatedPayment : p))
          );
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-8">Admin Dashboard</h1>
        <button
          onClick={() => setActiveTab("overview")}
          className={`mb-3 text-left ${activeTab === "overview" ? "font-bold text-blue-400" : ""}`}
        >
          <BarChart3 className="inline mr-2" /> Overview
        </button>
        <button
          onClick={() => setActiveTab("expenses")}
          className={`mb-3 text-left ${activeTab === "expenses" ? "font-bold text-blue-400" : ""}`}
        >
          <ShoppingCart className="inline mr-2" /> Expenses
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`mb-3 text-left ${activeTab === "payments" ? "font-bold text-blue-400" : ""}`}
        >
          <CreditCard className="inline mr-2" /> Payments
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-100">
        {activeTab === "overview" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 shadow rounded">
                <h3 className="font-semibold mb-2">Total Payments</h3>
                <p className="text-2xl">Rs. {incomeData.totalPayments}</p>
              </div>
              <div className="bg-white p-6 shadow rounded">
                <h3 className="font-semibold mb-2">Total Expenses</h3>
                <p className="text-2xl">Rs. {incomeData.totalExpenses}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "expenses" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Expenses</h2>
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense._id}
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => setSelectedExpenseId(expense._id)}
                  >
                    <td className="border px-4 py-2">{expense.expenseId}</td>
                    <td className="border px-4 py-2">{expense.description}</td>
                    <td className="border px-4 py-2">Rs. {expense.amount}</td>
                    <td className="border px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "payments" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Payments</h2>
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Resident</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Type</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p.paymentId}
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => setSelectedPaymentId(p.paymentId)}
                  >
                    <td className="border px-4 py-2">{p.paymentId}</td>
                    <td className="border px-4 py-2">{p.residentId}</td>
                    <td className="border px-4 py-2">Rs. {p.totalAmount}</td>
                    <td className="border px-4 py-2">{p.paymentType}</td>
                    <td className={`border px-4 py-2 ${p.status === "Completed" ? "text-green-600" : "text-yellow-600"}`}>
                      {p.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SN_AdminBillingDashboard;
