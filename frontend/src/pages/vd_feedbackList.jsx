import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import ReplyModal from "../components/vd_replyModal.jsx";
import ConfirmDialog from "../components/vd_confirmDialog.jsx";


const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filters, setFilters] = useState({ feedbackType: "", feedbackAbout: "", from: "", to: "" });
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });


  const fetchFeedbacks = async () => {
    try {
      const query = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))).toString();
      const res = await axiosInstance.get(`/feedback?${query}`);
      setFeedbacks(res.data);
    } catch {
      toast.error("Failed to load feedbacks");
    }
  };

  const handleUpdate = async (id, status, reply) => {
    try {
      await axiosInstance.patch(`/feedback/${id}`, { status, reply });
      toast.success("Feedback updated!");
      fetchFeedbacks();
    } catch {
      toast.error("Failed to update feedback");
    }
  };

  const handleDelete = async (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Feedback',
      message: 'Are you sure you want to delete this feedback?',
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/feedback/${id}`);
          toast.success("Feedback deleted!");
          fetchFeedbacks();
        } catch {
          toast.error("Failed to delete feedback");
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [filters]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Resident Feedback</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <select
          value={filters.feedbackType}
          onChange={(e) => setFilters({ ...filters, feedbackType: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option>Complaint</option>
          <option>Suggestion</option>
          <option>Request</option>
          <option>Compliment</option>
        </select>

        <select
          value={filters.feedbackAbout}
          onChange={(e) => setFilters({ ...filters, feedbackAbout: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">All About</option>
          <option>Maintenance</option>
          <option>Services</option>
          <option>Bookings</option>
          <option>Deliveries</option>
          <option>Billing</option>
          <option>Other</option>
        </select>

        <label className="text-sm text-gray-600 self-center">From</label>
        <input
          type="date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          className="border p-2 rounded"
          title="From"
        />

        <label className="text-sm text-gray-600 self-center">To</label>
        <input
          type="date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          className="border p-2 rounded"
          title="To"
        />
      </div>

      <table className="w-full border-collapse border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 w-24">Feedback ID</th>
            <th className="border p-2 w-24">Resident ID</th>
            <th className="border p-2">Resident</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">About</th>
            <th className="border p-2">Message</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((f) => (
            <tr key={f._id}>
              <td className="border p-2 w-24 whitespace-nowrap">{f.feedbackId}</td>
              <td className="border p-2 w-24 whitespace-nowrap">{f.residentId || f.userId?.userId}</td>
              <td className="border p-2">{f.userId?.firstName} {f.userId?.lastName}</td>
              <td className="border p-2">{f.feedbackType}</td>
              <td className="border p-2">{f.feedbackAbout}</td>
              <td className="border p-2">{f.message}</td>
              <td className="border p-2">
                <select
                  value={f.status}
                  onChange={(e) => handleUpdate(f._id, e.target.value, f.reply)}
                  className="border p-1 rounded"
                >
                  <option>Pending</option>
                  <option>Reviewed</option>
                  <option>Resolved</option>
                </select>
              </td>
              <td className="border p-2">{f.feedbackDate ? new Date(f.feedbackDate).toLocaleDateString() : "—"}</td>
              <td className="border p-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedFeedbackId(f.feedbackId)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Reply
                  </button>

              
                  <button
                    onClick={() => handleDelete(f._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

        <ReplyModal
              open={!!selectedFeedbackId}
              onClose={() => setSelectedFeedbackId(null)}
              feedbackId={selectedFeedbackId}
        />

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        />
    </div>
  );
};

export default FeedbackList;
