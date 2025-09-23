// src/pages/SN_AdminBillingDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/vd_sidebar";
import SN_IncomeTab from "../components/SN_IncomeTab";
import SN_ExpenseTab from "../components/SN_ExpenseManager";
import SN_PaymentDetail from "../components/SN_PaymentDetail";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const SN_AdminBillingDashboard = () => {
  const [activeItem, setActiveItem] = useState("billing");
  const [activeTab, setActiveTab] = useState("overview");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { month: String(now.getMonth() + 1).padStart(2, "0"), year: String(now.getFullYear()) };
  });

  const [payments, setPayments] = useState([]);
  const [offlinePending, setOfflinePending] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const navigate = useNavigate();

  // Fetch income/expense totals
  const fetchIncomeData = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/expenses/calculateIncome?month=${selectedMonth.month}&year=${selectedMonth.year}`);
      const data = await res.json();
      setTotalIncome(data.totalIncome || 0);
      setTotalExpenses(data.totalExpenses || 0);
    } catch (err) {
      console.error("Error fetching income data:", err);
    }
  };

  // Fetch all payments
  const fetchPayments = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/payments");
      const data = await res.json();
      setPayments(data);

      // Filter only offline + pending payments
      const pending = data.filter(p => p.paymentType === "Offline" && p.status === "Pending");
      setOfflinePending(pending);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  useEffect(() => {
    fetchIncomeData();
    fetchPayments();
  }, [selectedMonth]);

  const handleUpdateExpenses = (expensesArray) => {
    const total = expensesArray.reduce((acc, exp) => acc + Number(exp.amount), 0);
    setTotalExpenses(total);
  };

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    switch (itemId) {
      case "order": navigate("/admin/orders"); break;
      case "product": navigate("/admin/products"); break;
      case "customer": navigate("/admin/customers"); break;
      case "employee": navigate("/admin/employees"); break;
      case "billing": navigate("/admin/billing"); break;
      case "analytics": navigate("/admin/analytics"); break;
      default: break;
    }
  };

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-");
    setSelectedMonth({ month, year });
  };

  const barData = [{ name: "Income", value: totalIncome }, { name: "Expenses", value: totalExpenses }];
  const pieData = [{ name: "Income", value: totalIncome }, { name: "Expenses", value: totalExpenses }];
  const COLORS = ["#16A34A", "#DC2626"];

  // Show Payment Detail if selected
  if (selectedPaymentId) {
    return (
      <SN_PaymentDetail
        paymentId={selectedPaymentId}
        goBack={() => setSelectedPaymentId(null)}
        onRemovePayment={(removedId) => {
          setOfflinePending(prev => prev.filter(p => p.paymentId !== removedId));
          setPayments(prev => prev.filter(p => p.paymentId !== removedId));
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Billing & Finance</h1>

        {/* Tabs + Month Selector */}
        <div className="flex justify-between items-center mb-6 border-b">
          <div className="flex space-x-4">
            {["overview","income","expenses","transactions","residents","pendingPayments","receipts"].map(tab => (
              <button
                key={tab}
                className={`pb-2 px-2 font-medium capitalize ${activeTab===tab?"border-b-2 border-green-600 text-green-600":"text-gray-600"}`}
                onClick={()=>setActiveTab(tab)}
              >
                {tab==="pendingPayments"?"Pending Payments":tab}
              </button>
            ))}
          </div>
          <div>
            <input type="month" value={`${selectedMonth.year}-${selectedMonth.month}`} onChange={handleMonthChange} className="border px-3 py-2 rounded shadow-sm"/>
          </div>
        </div>

        {/* Overview */}
        {activeTab==="overview" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-100 p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold">Total Income</h3>
                <p className="text-3xl font-bold text-green-700 mt-2">Rs. {totalIncome.toLocaleString()}</p>
              </div>
              <div className="bg-red-100 p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold">Total Expenses</h3>
                <p className="text-3xl font-bold text-red-700 mt-2">Rs. {totalExpenses.toLocaleString()}</p>
              </div>
              <div className="bg-gray-100 p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold">Net Profit / Loss</h3>
                <p className={`text-3xl font-bold mt-2 ${totalIncome-totalExpenses>=0?"text-green-600":"text-red-600"}`}>
                  Rs. {(totalIncome-totalExpenses).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Income vs Expenses (Bar Chart)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#16A34A" />
                    <Bar dataKey="value" fill="#DC2626" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Income vs Expenses (Pie Chart)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {pieData.map((entry,index)=> <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab==="income" && <SN_IncomeTab selectedMonth={selectedMonth}/>}
        {activeTab==="expenses" && <SN_ExpenseTab selectedMonth={selectedMonth} onUpdateFinancials={handleUpdateExpenses}/>}

        {/* Transactions */}
        {activeTab==="transactions" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Transactions</h2>
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length>0 ? transactions.map((t,idx)=>(
                  <tr key={idx}>
                    <td className="border px-4 py-2">{new Date(t.date).toLocaleString()}</td>
                    <td className="border px-4 py-2 capitalize">{t.type}</td>
                    <td className={`border px-4 py-2 font-semibold ${t.isPositive?"text-green-600":"text-red-600"}`}>{t.displayAmount}</td>
                  </tr>
                )): <tr><td colSpan={3} className="p-4 text-center text-gray-500">No transactions available</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Residents */}
        {activeTab==="residents" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Residents Payment Status</h2>
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Payment ID</th>
                  <th className="border p-2">Resident</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p=>(
                  <tr key={p.paymentId} className="cursor-pointer hover:bg-gray-200" onClick={()=>setSelectedPaymentId(p.paymentId)}>
                    <td className="border px-4 py-2">{p.paymentId}</td>
                    <td className="border px-4 py-2">{p.residentId}</td>
                    <td className="border px-4 py-2">Rs. {p.totalAmount}</td>
                    <td className="border px-4 py-2">{p.paymentType}</td>
                    <td className={`border px-4 py-2 ${p.status==="Completed"?"text-green-600":"text-yellow-600"}`}>{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pending Payments */}
        {activeTab==="pendingPayments" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Pending Offline Payments</h2>
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
                {offlinePending.length>0 ? offlinePending.map(p=>(
                  <tr key={p.paymentId} className="cursor-pointer hover:bg-gray-200" onClick={()=>setSelectedPaymentId(p.paymentId)}>
                    <td className="border px-4 py-2">{p.paymentId}</td>
                    <td className="border px-4 py-2">{p.residentId}</td>
                    <td className="border px-4 py-2">Rs. {p.totalAmount}</td>
                    <td className="border px-4 py-2 text-yellow-600">{p.status}</td>
                  </tr>
                )):<tr><td colSpan={4} className="p-4 text-center text-gray-500">No pending offline payments</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {/* Receipts */}
        {activeTab==="receipts" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Receipts</h2>
            <p>Coming soon: Download and view individual receipts.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SN_AdminBillingDashboard;
