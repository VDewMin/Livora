import { ArrowLeftIcon } from 'lucide-react';
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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !phone_no.trim() || !email.trim()) {
      toast.error("Please provide all fields (Name, Content, Phone, Email)");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/notes', {
        title,
        content,
        phone_no,
        email
      });

      toast.success("Note created successfully");
      navigate("/notes");
    } catch (error) {
      console.log("Error creating note:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200 flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Link to="/landing" className="btn btn-ghost mb-6 flex items-center text-teal-800 hover:text-teal-600">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <div className="card bg-white shadow-lg rounded-lg overflow-hidden border border-teal-200">
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
                    className="input input-bordered w-full bg-white border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                  <label className="label text-lg font-semibold text-teal-700 block mb-2">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-32 w-full bg-white border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all resize-vertical"
                    placeholder="Note content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>

                <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                  <label className="label text-lg font-semibold text-teal-700 block mb-2">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24 w-full bg-white border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all resize-vertical"
                    placeholder="eg : 0712345678"
                    value={phone_no}
                    onChange={(e) => setPhone_no(e.target.value)}
                  ></textarea>
                </div>

                <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                  <label className="label text-lg font-semibold text-teal-700 block mb-2">
                    <span className="label-text">Email</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24 w-full bg-white border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all resize-vertical"
                    placeholder="eg : abc@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></textarea>
                </div>

                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary text-white bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 transition-all px-6 py-3 rounded-full"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Appointment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDCreatePage;