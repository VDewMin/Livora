import { useState } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const ReplyModal = ({ open, onClose, feedbackId }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!subject || !message) return toast.error("Please fill all fields");

    try {
      await axiosInstance.post(`/feedback/reply/${feedbackId}`, { subject, message });
      toast.success("Reply sent successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reply");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Send Email Reply</h2>
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <textarea
          rows="5"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSend} className="px-3 py-2 bg-blue-600 text-white rounded">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
