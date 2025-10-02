import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/vd_sidebar";
import SN_IncomeTab from "../components/SN_IncomeTab";
import SN_ExpenseTab from "../components/SN_ExpenseManager";
import SN_PaymentDetail from "../components/SN_PaymentDetail";
import ResidentTable from "../components/SN_ResidentTable"; // ✅ new component
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API_URL = "http://localhost:5001/api";

const SN_AdminBillingDashboard = () => {
  const [activeItem, setActiveItem] = useState("billing");
  const [activeTab, setActiveTab] = useState("overview");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return {
      month: String(now.getMonth() + 1).padStart(2, "0"),
      year: String(now.getFullYear()),
    };
  });

  const [payments, setPayments] = useState([]);
  const [offlinePending, setOfflinePending] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [residentPayments, setResidentPayments] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const navigate = useNavigate();

  // ---------- Fetch Income/Expenses ----------
  const fetchIncomeData = async () => {
    try {
      const res = await fetch(
        `${API_URL}/expenses/calculateIncome?month=${selectedMonth.month}&year=${selectedMonth.year}`
      );
      const data = await res.json();
      setTotalIncome(Number(data.totalIncome || 0));
      setTotalExpenses(Number(data.totalExpenses || 0));
    } catch (err) {
      console.error("Error fetching income data:", err);
    }
  };

  // ---------- Fetch Payments ----------
  const fetchPayments = async () => {
    try {
      const res = await fetch(
        `${API_URL}/payments?month=${selectedMonth.month}&year=${selectedMonth.year}`
      );
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);

      const pending = (Array.isArray(data) ? data : []).filter(
        (p) => p.paymentType === "Offline" && p.status === "Pending"
      );
      setOfflinePending(pending);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Error fetching payments:", err);
      return [];
    }
  };

  // ---------- Fetch Expenses ----------
  const fetchExpenses = async () => {
    try {
      const res = await fetch(
        `${API_URL}/expenses?month=${selectedMonth.month}&year=${selectedMonth.year}`
      );
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Error fetching expenses:", err);
      return [];
    }
  };

  // ---------- Fetch Transactions ----------
  const fetchTransactions = async () => {
    const [paymentsData, expensesData] = await Promise.all([
      fetchPayments(),
      fetchExpenses(),
    ]);

    const incomeTx = (paymentsData || [])
      .filter((p) => p.status === "Completed")
      .map((p) => ({
        id:
          p.paymentId ||
          p._id ||
          `pay-${Math.random().toString(36).slice(2, 9)}`,
        type: "income",
        date: p.paymentDate ? new Date(p.paymentDate) : new Date(),
        amount: Number(p.totalAmount || 0),
      }));

    const expenseTx = (expensesData || []).map((e) => ({
      id:
        e.expenseId ||
        e._id ||
        `exp-${Math.random().toString(36).slice(2, 9)}`,
      type: "expense",
      date: e.date ? new Date(e.date) : new Date(),
      amount: Number(e.amount || 0),
    }));

    const allTx = [...incomeTx, ...expenseTx].sort((a, b) => b.date - a.date);
    setTransactions(allTx);
  };

  // ---------- Fetch Resident Payments ----------
const fetchResidentPayments = async () => {
  try {
    const res = await fetch(
      `${API_URL}/payments/resident-status?month=${selectedMonth.month}&year=${selectedMonth.year}`
    );
    const data = await res.json();
    setResidentPayments(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Error fetching resident payments:", err);
  }
};


  // ---------- On Month Change ----------
  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-");
    setSelectedMonth({ month, year });
  };

  // ---------- Effect ----------
  useEffect(() => {
    fetchIncomeData();
    fetchTransactions();
    fetchResidentPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  // ---------- When expenses update ----------
  const handleUpdateExpenses = (expensesArray) => {
    const total = (expensesArray || []).reduce(
      (acc, exp) => acc + Number(exp.amount || 0),
      0
    );
    setTotalExpenses(total);
    fetchIncomeData();
    fetchTransactions();
  };

  // ---------- Chart Data ----------
  const barData = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
  ];
  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expenses", value: totalExpenses },
  ];
  const COLORS = ["#16A34A", "#DC2626"];
  const netIncome = Number(totalIncome) - Number(totalExpenses);

  if (selectedPaymentId) {
    return (
      <SN_PaymentDetail
        paymentId={selectedPaymentId}
        goBack={() => setSelectedPaymentId(null)}
        onRemovePayment={(removedId) => {
          setOfflinePending((prev) =>
            prev.filter((p) => p.paymentId !== removedId)
          );
          setPayments((prev) =>
            prev.filter((p) => p.paymentId !== removedId)
          );
          fetchTransactions();
          fetchIncomeData();
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Billing & Finance
        </h1>

        {/* Tabs + Month Selector */}
        <div className="flex justify-between items-center mb-6 border-b">
          <div className="flex space-x-4">
            {[
              "overview",
              "income",
              "expenses",
              "transactions",
              "residents",
              "pendingPayments",
              "receipts",
            ].map((tab) => (
              <button
                key={tab}
                className={`pb-2 px-2 font-medium capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-green-600 text-green-600"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "pendingPayments" ? "Pending Payments" : tab}
              </button>
            ))}
          </div>

          <div>
            <input
              type="month"
              value={`${selectedMonth.year}-${selectedMonth.month}`}
              onChange={handleMonthChange}
              className="border px-3 py-2 rounded shadow-sm"
            />
          </div>
        </div>

        {/* Tabs */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow text-center">
                <h2 className="text-lg font-semibold text-gray-700">
                  Total Income
                </h2>
                <p className="text-3xl font-bold text-green-600">
                  Rs. {Number(totalIncome).toLocaleString()}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow text-center">
                <h2 className="text-lg font-semibold text-gray-700">
                  Total Expenses
                </h2>
                <p className="text-3xl font-bold text-red-600">
                  Rs. {Number(totalExpenses).toLocaleString()}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow text-center">
                <h2 className="text-lg font-semibold text-gray-700">
                  Net Profit / Loss
                </h2>
                <p
                  className={`text-3xl font-bold mt-2 ${
                    netIncome >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Rs. {netIncome.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg font-semibold mb-4">
                  Income vs Expenses (Bar)
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Amount">
                      {barData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === "Income" ? "#16A34A" : "#DC2626"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-lg font-semibold mb-4">
                  Financial Breakdown (Pie)
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "income" && (
          <SN_IncomeTab selectedMonth={selectedMonth} />
        )}

        {activeTab === "expenses" && (
          <SN_ExpenseTab
            selectedMonth={selectedMonth}
            onUpdateFinancials={handleUpdateExpenses}
          />
        )}

        {activeTab === "transactions" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Transactions
            </h2>
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <tr key={`${t.type}-${t.id}-${t.date.getTime()}`}>
                      <td className="border px-4 py-2">{t.id}</td>
                      <td className="border px-4 py-2 capitalize">{t.type}</td>
                      <td className="border px-4 py-2">
                        {t.date.toLocaleString()}
                      </td>
                      <td
                        className={`border px-4 py-2 font-semibold ${
                          t.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {t.type === "income" ? "+" : "-"} Rs.{" "}
                        {Number(t.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-gray-500"
                    >
                      No transactions available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "residents" && (
          <ResidentTable residents={residentPayments} />
        )}


        {activeTab === "pendingPayments" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">
              Pending Offline Payments
            </h2>
            {offlinePending.length > 0 ? (
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Payment ID</th>
                    <th className="border p-2">Resident</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {offlinePending.map((p) => (
                    <tr
                      key={p.paymentId || p._id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedPaymentId(p.paymentId)}
                    >
                      <td className="border px-4 py-2">{p.paymentId}</td>
                      <td className="border px-4 py-2">
                        {p.residentId ??
                          p.residentName ??
                          p.resident ??
                          "—"}
                      </td>
                      <td className="border px-4 py-2 font-semibold">
                        Rs. {Number(p.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">
                        <span className="font-medium text-yellow-600">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center">
                No pending offline payments
              </p>
            )}
          </div>
        )}

        {activeTab === "receipts" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Receipts
            </h2>
            <p>Coming soon: Download and view individual receipts.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SN_AdminBillingDashboard;
