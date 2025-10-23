import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminAnnouncements() {
  const [form, setForm] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5001/api/announcements/send", form);
      toast.success("Announcement sent successfully!");
      setForm({ title: "", message: "", date: "" });
    } catch (err) {
      console.error(err);
      toast.error("Error sending announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  p-6">
      <div className=" mt-0 bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-sky-600 to-indigo-700 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            📢 Send New Announcement
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Notify all apartment residents with an important update.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Title*
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter announcement title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Message*
            </label>
            <textarea
              name="message"
              placeholder="Write your announcement message here..."
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Date*
            </label>
            <input
              type="date"
              name="date"
              placeholder="Enter date"
              value={form.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? "Sending..." : "Send Announcement"}
          </button>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 text-center border-t">
          Apartment Center Admin Panel • Stay Connected 🏙️
        </div>
      </div>
    </div>
  );
}

export default AdminAnnouncements;
