import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SN_ExpenseDetail from "../components/SN_ExpenseDetail";

const API_URL = "http://localhost:5001/api/expenses";

const CATEGORIES = [
  "Utilities", "Staff Salaries", "Repairs & Maintenance", "Supplies",
  "Security", "Waste Management", "Pest Control", "Landscaping",
  "Insurance", "Legal & Compliance", "Marketing", "Miscellaneous"
];

const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Online Payment", "Card", "Other"];

 const getTodayLocal = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

export default function SN_ExpenseTab({ selectedMonth, onUpdateFinancials }) {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [today, setToday] = useState(getTodayLocal());
  const [newExpense, setNewExpense] = useState({
    expenseId: "",
    category: CATEGORIES[0],
    paymentMethod: PAYMENT_METHODS[0],
    notes: "",
    amount: "",
    date: today,
    attachment: null,
  });

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API_URL}?month=${selectedMonth.month}&year=${selectedMonth.year}`);
      const data = await res.json();
      setExpenses(data);
      onUpdateFinancials && onUpdateFinancials(data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedMonth]);

  const handleFileChange = (e) => {
    setNewExpense({ ...newExpense, attachment: e.target.files[0] });
  };

  const addExpense = async () => {
    if (!newExpense.expenseId || !newExpense.notes || !newExpense.amount) {
      return toast.error("Please fill all required fields");
    }

    if (isNaN(newExpense.amount) || newExpense.amount <= 0) {
      return toast.error("Amount must be a positive number");
    }

    const today = getTodayLocal();
    if (newExpense.date > today) {
      return toast.error("Date cannot be in the future");
    }
    try {
      const formData = new FormData();
      formData.append("expenseId", newExpense.expenseId);
      formData.append("category", newExpense.category);
      formData.append("paymentMethod", newExpense.paymentMethod);
      formData.append("notes", newExpense.notes);
      formData.append("amount", newExpense.amount);
      formData.append("date", newExpense.date);
      if (newExpense.attachment) formData.append("attachment", newExpense.attachment);

      const res = await fetch(API_URL, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to add expense");

      toast.success("Expense added successfully!");
      setShowModal(false);
      setNewExpense({
        expenseId: "",
        category: CATEGORIES[0],
        paymentMethod: PAYMENT_METHODS[0],
        notes: "",
        amount: "",
        date: "",
        attachment: null,
      });
      fetchExpenses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add expense");
    }
  };

  // When an expense is deleted in ExpenseDetail
  const handleRemoveExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e._id !== id));
    onUpdateFinancials && onUpdateFinancials(expenses.filter((e) => e._id !== id));
    setSelectedExpenseId(null);
  };

  return (
    <div className="p-6 relative">
      {/* Expense Detail View */}
      {selectedExpenseId ? (
        <SN_ExpenseDetail
          expenseId={selectedExpenseId}
          goBack={() => setSelectedExpenseId(null)}
          onRemoveExpense={handleRemoveExpense}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Manage Expenses</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              + Add Expense
            </button>
          </div>

          {/* Expenses Table */}
          <table className="border w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Payment Method</th>
                <th className="border p-2">Notes</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr
                  key={exp._id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedExpenseId(exp._id)}
                >
                  <td className="border px-2 py-1">{exp.expenseId}</td>
                  <td className="border px-2 py-1">{exp.category}</td>
                  <td className="border px-2 py-1">{exp.paymentMethod}</td>
                  <td className="border px-2 py-1">{exp.notes}</td>
                  <td className="border px-2 py-1">Rs. {exp.amount}</td>
                  <td className="border px-2 py-1">{new Date(exp.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Expense Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start pt-20 z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
                <h3 className="text-lg font-bold mb-3">Add New Expense</h3>
                <input
                  className="border p-2 rounded w-full mb-2"
                  placeholder="Expense ID"
                  value={newExpense.expenseId}
                  onChange={(e) => setNewExpense({ ...newExpense, expenseId: e.target.value })}
                />
                <select
                  className="border p-2 rounded w-full mb-2"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <select
                  className="border p-2 rounded w-full mb-2"
                  value={newExpense.paymentMethod}
                  onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                >
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
                <input
                  className="border p-2 rounded w-full mb-2"
                  placeholder="Notes"
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                />
                <input
                  className="border p-2 rounded w-full mb-2"
                  type="number"
                  min="1"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
                <input
                  className="border p-2 rounded w-full mb-2"
                  type="date"
                  max={today}
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
                <input
                  className="border p-2 rounded w-full mb-4"
                  type="file"
                  onChange={handleFileChange}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowModal(false)} className="px-3 py-1 border rounded">
                    Cancel
                  </button>
                  <button
                    onClick={addExpense}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
