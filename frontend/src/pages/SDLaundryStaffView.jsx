import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../lib/axios.js';
import toast from 'react-hot-toast';

const SDLaundryStaffView = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axiosInstance.get('/api/laundry');
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
      const updatedRequest = await axiosInstance.put(`/api/laundry/${id}`, { status });
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
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200 py-10">
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-teal-800 mb-4">Laundry Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((request) => (
            <div key={request._id} className="card bg-white shadow-lg p-4 rounded-lg">
              <p><strong>Schedule ID:</strong> {request.schedule_id}</p>
              <p><strong>Name:</strong> {request.resident_name}</p>
              <p><strong>Weight:</strong> {request.weight} kg</p>
              <p><strong>Service:</strong> {request.service_type}</p>
              <p><strong>Cost (LKR):</strong> {request.total_cost.toLocaleString()}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <select
                value={request.status}
                onChange={(e) => handleUpdateStatus(request._id, e.target.value)}
                className="select select-bordered w-full mt-2"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Link to={`/laundry/details/${request.schedule_id}`} className="btn btn-info mt-2">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SDLaundryStaffView;