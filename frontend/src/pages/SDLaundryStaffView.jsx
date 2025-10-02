import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../lib/axios.js';
import toast from 'react-hot-toast';
import { PlusCircleIcon } from 'lucide-react';

const SDLaundryStaffView = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get('/laundry');
        setRequests(response.data);
      } catch (error) {
        toast.error('Failed to load requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    if (status === 'completed' && !window.confirm('Mark as completed?')) return;
    try {
      const updatedRequest = await axiosInstance.put(`/laundry/${id}`, { status });
      setRequests((prev) =>
        prev.map((req) => (req._id === id ? updatedRequest.data : req))
      );
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200 py-2">
      <div className="max-w-6xl mx-auto">
        {/* Navbar */}
        <div className="navbar bg-white shadow-md p-2 rounded-lg mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-teal-800">Laundry Requests</h2>
          <Link to="/laundry/request" className="btn btn-primary bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-teal-700 transition-all focus:outline-none">
            <PlusCircleIcon className="h-6 w-6" />
          </Link>
        </div>

        {/* Requests Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((request) => (
              <div key={request._id} className="card bg-white shadow-lg p-4 rounded-lg">
                <p><strong>Schedule ID:</strong> {request.schedule_id}</p>
                <p><strong>Name:</strong> {request.resident_name}</p>
                <p><strong>Weight:</strong> {request.weight} kg</p>
                <p><strong>Service:</strong> {request.service_type}</p>
                <p><strong>Cost (LKR):</strong> {request.total_cost.toLocaleString()}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <Link to={`/laundry/details/${request.schedule_id}`} className="btn btn-info mt-2">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDLaundryStaffView;