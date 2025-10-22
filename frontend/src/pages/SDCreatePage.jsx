
import { ArrowLeftIcon, CheckCircleIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios.js';

const SDCreatePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); 
  const [phone_no, setPhone_no] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Name is required';
    if (!content.trim()) newErrors.content = 'Content is required';
    if (!phone_no.trim()) {
      newErrors.phone_no = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone_no)) {
      newErrors.phone_no = 'Phone number must be 10 digits';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await axiosInstance.post('/notes', {
        title,
        content,
        phone_no,
        email
      });

      toast.success("Note created successfully");
      setShowSuccess(true);
      // navigate("/landing"); // Commented to show success modal instead
    } catch (error) {
      console.log("Error creating note:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate("/landing");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200 flex flex-col">
      {/* Header */}
      <header className="bg-teal-800 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold text-xl">PR</span>
            </div>
            <h1 className="text-2xl font-bold">Pearl Residencies</h1>
          </div>
          <nav className="space-x-4 hidden md:flex">
            <Link to="/landing" className="hover:text-teal-300">Home</Link>
            <Link to="/dashboard" className="hover:text-teal-300">Dashboard</Link>
            <Link to="/profile" className="hover:text-teal-300">Profile</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Link to="/landing" className="btn btn-ghost mb-6 flex items-center text-teal-800 hover:text-teal-600 transition">
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Home
            </Link>

            <div className="card bg-white shadow-xl rounded-lg overflow-hidden border border-teal-200">
              <div className="card-body p-6">
                <h2 className="card-title text-3xl font-bold text-teal-800 mb-6 text-center bg-teal-50 p-4 rounded-t-lg">
                  Create Your Appointment
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                    <label className="label text-lg font-semibold text-teal-700 block mb-2">
                      <span className="label-text">Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="K.D Kumara"
                      className={`input input-bordered w-full bg-white border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all ${errors.title ? 'border-red-500' : ''}`}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                    <label className="label text-lg font-semibold text-teal-700 block mb-2">
                      <span className="label-text">Content</span>
                    </label>
                    <textarea
                      className={`textarea textarea-bordered h-32 w-full bg-white border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all resize-vertical ${errors.content ? 'border-red-500' : ''}`}
                      placeholder="Note content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                  </div>

                  <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                    <label className="label text-lg font-semibold text-teal-700 block mb-2">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <textarea
                      className={`textarea textarea-bordered h-24 w-full bg-white border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all resize-vertical ${errors.phone_no ? 'border-red-500' : ''}`}
                      placeholder="eg : 0712345678"
                      value={phone_no}
                      onChange={(e) => setPhone_no(e.target.value)}
                    ></textarea>
                    {errors.phone_no && <p className="text-red-500 text-sm mt-1">{errors.phone_no}</p>}
                  </div>

                  <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                    <label className="label text-lg font-semibold text-teal-700 block mb-2">
                      <span className="label-text">Email</span>
                    </label>
                    <textarea
                      className={`textarea textarea-bordered h-24 w-full bg-white border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all resize-vertical ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="eg : abc@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    ></textarea>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div className="card-actions justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary text-white bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 transition-all px-6 py-3 rounded-full flex items-center"
                      disabled={loading}
                    >
                      {loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
                      {loading ? 'Creating...' : 'Create Appointment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-teal-800 mb-2">Success!</h3>
              <p className="text-gray-600 mb-4">Your appointment has been created successfully.</p>
              <button
                className="btn btn-primary bg-teal-600 text-white hover:bg-teal-700 px-6 py-2 rounded-full"
                onClick={handleCloseSuccess}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-teal-800 text-white p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; 2025 Pearl Residencies. All rights reserved.</p>
          <p className="text-sm mt-1">Contact: +971 4 XXXX XXXX | Email: info@pearlresidencies.com</p>
        </div>
      </footer>
    </div>
  );
};

export default SDCreatePage;
