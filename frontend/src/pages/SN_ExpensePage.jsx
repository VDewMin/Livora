import { useEffect, useState } from "react";

const API_URL = "http://localhost:5001/api/expenses";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ expenseId: "", description: "", amount: "", date: "" });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ description: "", amount: "", date: "" });

  // --- API Calls ---
  const fetchExpenses = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const createExpense = async () => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormData({ expenseId: "", description: "", amount: "", date: "" });
      fetchExpenses();
    } catch (err) {
      console.error("Error creating expense:", err);
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
    } catch (err) {
      console.error("Error updating expense:", err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Expense Manager</h1>

      {/* Add Expense Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!formData.expenseId || !formData.description || !formData.amount || !formData.date) {
            alert("Please fill all fields!");
            return;
          }
          createExpense();
        }}
        className="p-4 border rounded-2xl shadow-md flex flex-col gap-2 w-[300px]"
      >
        <input
          className="border p-2 rounded"
          placeholder="Expense ID"
          value={formData.expenseId}
          onChange={(e) => setFormData({ ...formData, expenseId: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600">
          Add Expense
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        {/* Read Only Table */}
        <div>
          <h2 className="text-lg font-bold mb-2">Read-Only Expenses</h2>
          <table className="border w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td className="border p-2">{exp.expenseId}</td>
                  <td className="border p-2">{exp.description}</td>
                  <td className="border p-2">{exp.amount}</td>
                  <td className="border p-2">{new Date(exp.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Editable Table */}
        <div>
          <h2 className="text-lg font-bold mb-2">Editable Expenses</h2>
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
                  <td className="border p-2">
                    {editId === exp._id ? (
                      <input
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="border p-1 rounded"
                      />
                    ) : (
                      exp.description
                    )}
                  </td>
                  <td className="border p-2">
                    {editId === exp._id ? (
                      <input
                        type="number"
                        value={editData.amount}
                        onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                        className="border p-1 rounded"
                      />
                    ) : (
                      exp.amount
                    )}
                  </td>
                  <td className="border p-2">
                    {editId === exp._id ? (
                      <input
                        type="date"
                        value={editData.date}
                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                        className="border p-1 rounded"
                      />
                    ) : (
                      new Date(exp.date).toLocaleDateString()
                    )}
                  </td>
                  <td className="border p-2">
                    {editId === exp._id ? (
                      <button
                        onClick={() => updateExpense(exp._id)}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
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
                    )}
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
        </div>

      </div>
    </div>
  );
}
