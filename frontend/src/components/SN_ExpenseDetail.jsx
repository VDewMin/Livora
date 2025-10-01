import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Utilities",
  "Staff Salaries",
  "Repairs & Maintenance",
  "Supplies",
  "Security",
  "Waste Management",
  "Pest Control",
  "Landscaping",
  "Insurance",
  "Legal & Compliance",
  "Marketing",
  "Miscellaneous"
];

const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Online Payment", "Card", "Other"];

const SN_ExpenseDetail = ({ expenseId, goBack, onRemoveExpense, onUpdateExpense }) => {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/expenses/${expenseId}`);
        const data = await res.json();
        if (data) {
          setExpense(data);
          setFormData({
            description: data.notes || "",
            amount: data.amount || 0,
            category: data.category || "",
            paymentMethod: data.paymentMethod || "",
            date: data.date ? new Date(data.date).toISOString().slice(0, 10) : "",
          });
        }
      } catch (err) {
        console.error("Error fetching expense:", err);
        toast.error("Failed to fetch expense");
      } finally {
        setLoading(false);
      }
    };
    fetchExpense();
  }, [expenseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => setEditMode(true);

  const handleCancel = () => {
    setEditMode(false);
    if (expense) {
      setFormData({
        description: expense.notes,
        amount: expense.amount,
        category: expense.category,
        paymentMethod: expense.paymentMethod,
        date: expense.date ? new Date(expense.date).toISOString().slice(0, 10) : "",
      });
    }
  };

const handleVerify = async () => {
  // ✅ Validation
  if (!formData.description || !formData.amount) {
    return toast.error("Please fill all required fields");
  }

  if (isNaN(formData.amount) || formData.amount <= 0) {
    return toast.error("Amount must be a positive number");
  }

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  if (formData.date > today) {
    return toast.error("Date cannot be in the future");
  }

  if (!window.confirm("Are you sure you want to save changes?")) return;

  try {
    setActionLoading(true);
    const res = await fetch(`http://localhost:5001/api/expenses/${expenseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes: formData.description,
        amount: formData.amount,
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        date: formData.date,
      }),
    });

    if (!res.ok) throw new Error("Failed to update expense");

    const updated = await res.json();
    toast.success("Expense updated successfully!");
    setExpense(updated);
    setEditMode(false);
    onUpdateExpense && onUpdateExpense(updated);
  } catch (err) {
    console.error(err);
    toast.error("Failed to update expense");
  } finally {
    setActionLoading(false);
  }
};


  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      setActionLoading(true);
      const res = await fetch(`http://localhost:5001/api/expenses/${expenseId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete expense");
      toast.success("Expense deleted successfully!");
      onRemoveExpense && onRemoveExpense(expenseId);
      goBack();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete expense");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading expense details...</p>;
  if (!expense) return <p className="text-center text-red-500">Expense not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 p-6 overflow-y-auto">
        <button
          onClick={goBack}
          className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          &larr; Back
        </button>

        <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Expense Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Expense ID" value={expense.expenseId} readOnly />
            
            {/* Category Dropdown */}
            {editMode ? (
              <SelectField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                options={CATEGORIES}
              />
            ) : (
              <Field label="Category" value={formData.category} readOnly />
            )}

            {/* Payment Method Dropdown */}
            {editMode ? (
              <SelectField
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                options={PAYMENT_METHODS}
              />
            ) : (
              <Field label="Payment Method" value={formData.paymentMethod} readOnly />
            )}

            <Field
              label="Notes"
              name="description"
              value={formData.description}
              readOnly={!editMode}
              onChange={handleInputChange}
            />
            <Field
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              readOnly={!editMode}
              onChange={handleInputChange}
            />
            <Field
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              readOnly={!editMode}
              onChange={handleInputChange}
            />
          </div>

          {expense.attachment?.data && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
              <img
                src={`data:${expense.attachment.contentType};base64,${bufferToBase64(expense.attachment.data)}`}
                alt="Attachment"
                className="max-w-sm border rounded-lg shadow-lg cursor-pointer hover:scale-105 transition"
                onClick={() => setIsImageOpen(true)}
              />
            </div>
          )}

          <div className="mt-6 flex gap-4">
            {!editMode && (
              <>
                <button onClick={handleUpdate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition">Update</button>
                <button onClick={handleDelete} disabled={actionLoading} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition disabled:opacity-50">Delete</button>
              </>
            )}

            {editMode && (
              <>
                <button onClick={handleVerify} disabled={actionLoading} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition disabled:opacity-50">{actionLoading ? "Processing..." : "Verify"}</button>
                <button onClick={handleCancel} disabled={actionLoading} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition disabled:opacity-50">Cancel</button>
              </>
            )}
          </div>
        </div>
      </div>

      {isImageOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={() => setIsImageOpen(false)}>
          <img src={`data:${expense.attachment.contentType};base64,${bufferToBase64(expense.attachment.data)}`} alt="Attachment Fullscreen" className="max-h-[90%] max-w-[90%] rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <button className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full shadow-md hover:bg-gray-200" onClick={() => setIsImageOpen(false)}>✕</button>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value, readOnly = true, onChange, name, type = "text" }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} readOnly={readOnly} className={`w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none ${readOnly ? "cursor-default" : ""}`} />
  </div>
);

const SelectField = ({ label, value, onChange, name, options }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
    <select name={name} value={value} onChange={onChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none">
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const bufferToBase64 = (buffer) => {
  if (buffer.data) buffer = buffer.data;
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
};

export default SN_ExpenseDetail;
