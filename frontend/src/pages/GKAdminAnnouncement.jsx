import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminAnnouncements() {
  const [form, setForm] = useState({ title: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/announcements/send", form);
      toast.success("Announcement sent to all residents!");
      setForm({ title: "", message: "" });
    } catch (err) {
      toast.error("Error sending announcement");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Send Announcement</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2"
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Send Announcement
        </button>
      </form>
    </div>
  );
}

export default AdminAnnouncements;
