import { useState } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { MessageSquare, AlertCircle, Lightbulb, ThumbsUp, Calendar, FileText } from "lucide-react";

const FeedbackForm = () => {
  const [feedbackType, setFeedbackType] = useState("Complaint");
  const [feedbackAbout, setFeedbackAbout] = useState("Maintenance");
  const [message, setMessage] = useState("");
  const [feedbackDate, setFeedbackDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axiosInstance.post("/feedback", { feedbackType, feedbackAbout, message, feedbackDate });
      toast.success("Feedback submitted successfully!");
      setMessage("");
      setFeedbackDate("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const getFeedbackIcon = () => {
    switch (feedbackType) {
      case "Complaint":
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case "Suggestion":
        return <Lightbulb className="w-6 h-6 text-yellow-600" />;
      case "Request":
        return <FileText className="w-6 h-6 text-blue-600" />;
      case "Compliment":
        return <ThumbsUp className="w-6 h-6 text-green-600" />;
      default:
        return <MessageSquare className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm p-8 my-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Submit Feedback</h2>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed">
          We value your input! Share your complaints, suggestions, requests, or compliments to help us improve our services.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              {getFeedbackIcon()}
              <span className="ml-2">Feedback Type</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                  required
                >
                  <option value="Complaint">Complaint</option>
                  <option value="Suggestion">Suggestion</option>
                  <option value="Request">Request</option>
                  <option value="Compliment">Compliment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={feedbackAbout}
                  onChange={(e) => setFeedbackAbout(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                  required
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="Services">Services</option>
                  <option value="Bookings">Bookings</option>
                  <option value="Deliveries">Deliveries</option>
                  <option value="Billing">Billing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Feedback Details
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={feedbackDate}
                  onChange={(e) => setFeedbackDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  rows="6"
                  placeholder="Please provide detailed information about your feedback..."
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  {message.length} characters
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium text-base disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;