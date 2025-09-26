import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5001/api/expenses";

export default function SN_ExpenseTab({ selectedMonth, onUpdateFinancials }) {
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ description: "", amount: "", date: "" });
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ expenseId: "", description: "", amount: "", date: "" });

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API_URL}?month=${selectedMonth.month}&year=${selectedMonth.year}`);
      const data = await res.json();
      setExpenses(data);
      onUpdateFinancials && onUpdateFinancials(data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      toast.error("Error fetching expenses")
    }
  };

  const addExpense = async () => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });
      setShowModal(false);
      setNewExpense({ expenseId: "", description: "", amount: "", date: "" });
      fetchExpenses();
      toast.success("Expense added Sucessfully")
    } catch (err) {
      console.error("Error creating expense:", err);
      toast.error("Error creating expense")
    }
  };

  const updateExpense = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      setEditId(null);
      fetchExpenses();
      toast.success("Expense Updated Succesfully")
    } catch (err) {
      console.error("Error updating expense:", err);
      toast.error("Error updating expense");
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchExpenses();
      toast.success("Expense deleted Succesfully")
    } catch (err) {
      console.error("Error deleting expense:", err);
      toast.error("Error deleting expense");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedMonth]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Expenses</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Expense
        </button>
      </div>

      <table className="border w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id}>
              <td className="border p-2">{exp.expenseId}</td>
              <td className="border p-2">{exp.description}</td>
              <td className="border p-2">Rs. {exp.amount}</td>
              <td className="border p-2">{new Date(exp.date).toLocaleDateString()}</td>
              <td className="border p-2">
                <button
                  onClick={() => {
                    setEditId(exp._id);
                    setEditData({
                      description: exp.description,
                      amount: exp.amount,
                      date: exp.date.split("T")[0],
                    });
                  }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteExpense(exp._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[350px]">
            <h3 className="text-lg font-bold mb-3">Add New Expense</h3>
            <input
              className="border p-2 rounded w-full mb-2"
              placeholder="Expense ID"
              value={newExpense.expenseId}
              onChange={(e) => setNewExpense({ ...newExpense, expenseId: e.target.value })}
            />
            <input
              className="border p-2 rounded w-full mb-2"
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            />
            <input
              className="border p-2 rounded w-full mb-2"
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            />
            <input
              className="border p-2 rounded w-full mb-4"
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1 border rounded">
                Cancel
              </button>
              <button onClick={addExpense} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[350px]">
            <h3 className="text-lg font-bold mb-3">Edit Expense</h3>
            <input
              className="border p-2 rounded w-full mb-2"
              placeholder="Description"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            />
            <input
              className="border p-2 rounded w-full mb-2"
              type="number"
              placeholder="Amount"
              value={editData.amount}
              onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
            />
            <input
              className="border p-2 rounded w-full mb-4"
              type="date"
              value={editData.date}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditId(null)} className="px-3 py-1 border rounded">
                Cancel
              </button>
              <button onClick={() => updateExpense(editId)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
