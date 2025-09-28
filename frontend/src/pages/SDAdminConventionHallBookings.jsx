import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Corrected import
import axiosInstance from '../lib/axios.js';
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const SDAdminConventionHallBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get('/convention-hall-bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Confirm ${newStatus} this booking?`)) return;
    try {
      const response = await axiosInstance.put(`/convention-hall-bookings/${id}/status`, { status: newStatus });
      setBookings(bookings.map(b => b._id === id ? response.data : b));
      toast.success(`Booking ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(`Failed to ${newStatus} booking`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-teal-100 to-indigo-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200 py-10">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-teal-800 mb-8 text-center animate-fade-in">
          Admin Convention Hall Bookings
        </h1>
        {bookings.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No bookings to review.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-teal-500 text-white">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Duration (hrs)</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 border-b">
                    <td className="py-3 px-4">{booking.name}</td>
                    <td className="py-3 px-4 flex items-center">
                      <CalendarIcon className="mr-2 text-teal-500" />
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">{booking.time_duration}</td>
                    <td className="py-3 px-4">
                      <span className={booking.status === 'cancelled' ? 'text-red-500' : booking.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                        disabled={booking.status !== 'pending'}
                      >
                        <CheckCircleIcon className="inline mr-1" /> Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        disabled={booking.status !== 'pending'}
                      >
                        <XCircleIcon className="inline mr-1" /> Reject
                      </button>
                      <Link
                        to={`/admin/convention-hall-booking/${booking._id}`} // Updated route
                        className="ml-2 text-indigo-500 hover:text-indigo-700"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple fade-in animation
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fadeIn 1s ease-in;
  }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default SDAdminConventionHallBookings;