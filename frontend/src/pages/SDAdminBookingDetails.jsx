import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios.js';
import { CalendarIcon, ClockIcon, UsersIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const SDAdminBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axiosInstance.get(`/convention-hall-bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error('Error fetching booking:', error.response?.data || error.message);
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === 'rejected' && !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    if (!window.confirm(`Confirm ${newStatus} this booking?`)) return;

    const payload = { status: newStatus };
    if (newStatus === 'rejected') payload.rejection_reason = rejectionReason;

    try {
      console.log('Sending payload:', payload); // Log payload for debugging
      const response = await axiosInstance.put(`/convention-hall-bookings/${id}/status`, payload);
      setBooking(response.data);
      toast.success(`Booking ${newStatus} successfully`);
      setRejectionReason(''); // Clear reason after submission
    } catch (error) {
      console.error('Error updating status:', error.response?.data || error.message);
      toast.error(`Failed to ${newStatus} booking. Check server logs for details.`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-teal-100 to-indigo-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-10 bg-gradient-to-r from-teal-100 to-indigo-200 min-h-screen">
        <h2 className="text-2xl font-bold text-gray-700">Booking Not Found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200 py-10">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
        <h2 className="text-3xl font-bold text-teal-800 mb-6 flex items-center">
          <CalendarIcon className="mr-2 text-teal-600" />
          Admin Booking Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700"><strong>Name:</strong> {booking.name}</p>
            <p className="text-gray-700"><strong>Phone:</strong> {booking.phone_number}</p>
            <p className="text-gray-700"><strong>Room Number:</strong> {booking.apartmentNo}</p>
            <p className="text-gray-700"><strong>Guests:</strong> {booking.number_of_guests}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 flex items-center">
              <ClockIcon className="mr-2 text-teal-600" />
              <strong>Duration:</strong> {booking.time_duration} hours
            </p>
            <p className="text-gray-700 flex items-center">
              <CalendarIcon className="mr-2 text-teal-600" />
              <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700"><strong>Purpose:</strong> {booking.purpose || 'N/A'}</p>
            <p className="text-gray-700">
              <strong>Status:</strong> 
              <span className={booking.status === 'rejected' ? 'text-red-600' : booking.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}>
                {booking.status}
              </span>
              {booking.rejection_reason && (
                <span className="ml-2 text-sm text-red-500">({booking.rejection_reason})</span>
              )}
            </p>
            <p className="text-gray-700"><strong>Cost (LKR):</strong> {booking.total_cost?.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-lg">
          <strong>Note:</strong> Approve or reject bookings based on availability and policy.
        </div>
        <div className="mt-6">
          {booking.status === 'pending' && (
            <>
              <div className="mb-4">
                <label className="block mb-2">Rejection Reason (if rejecting)</label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Enter rejection reason"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleStatusUpdate('accepted')}
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  <CheckCircleIcon className="mr-2" /> Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  <XCircleIcon className="mr-2" /> Reject
                </button>
              </div>
            </>
          )}
          <button
            onClick={() => navigate('/admin/convention-hall-bookings')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default SDAdminBookingDetails;