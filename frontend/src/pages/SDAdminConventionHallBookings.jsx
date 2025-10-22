import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../lib/axios.js';
import { CalendarIcon, Trash2Icon } from 'lucide-react';
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

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this booking?`)) return;
    try {
      await axiosInstance.delete(`/convention-hall-bookings/${id}`);
      setBookings(bookings.filter(b => b._id !== id));
      toast.success('Booking deleted successfully');
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-teal-100 to-indigo-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  // Categorize bookings
  const approvedBookings = bookings.filter(b => b.status === 'accepted');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const rejectedBookings = bookings.filter(b => b.status === 'rejected');

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200 py-10">
      <div className="max-w-6xl mx-auto p-6">
        <nav className="bg-teal-700 text-white p-2 mb-6 rounded-lg shadow-md">
          <ul className="flex justify-around">
            <li>
              <Link
                to="/admin/convention-hall-bookings"
                className="px-4 py-2 rounded hover:bg-teal-600 transition-all"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                Convention Hall
              </Link>
            </li>
            <li>
              <Link
                to="/laundry/staff"
                className="px-4 py-2 rounded hover:bg-teal-600 transition-all"
              >
                Laundry
              </Link>
            </li>
          </ul>
        </nav>

        <h1 className="text-4xl font-bold text-teal-800 mb-8 text-center animate-fade-in">
          Admin Convention Hall Bookings
        </h1>

        {approvedBookings.length + pendingBookings.length + rejectedBookings.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No bookings to review.</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-teal-700 mb-4">Approved Bookings</h2>
            <div className="overflow-x-auto mb-6">
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
                  {approvedBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 border-b">
                      <td className="py-3 px-4">{booking.name}</td>
                      <td className="py-3 px-4 flex items-center">
                        <CalendarIcon className="mr-2 text-green-500" />
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">{booking.time_duration}</td>
                      <td className="py-3 px-4"><span className="text-green-500">Accepted</span></td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded mr-2 hover:bg-red-600"
                        >
                          <Trash2Icon className="inline mr-1" /> Delete
                        </button>
                        <Link
                          to={`/admin/convention-hall-booking/${booking._id}`}
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

            <h2 className="text-2xl font-semibold text-teal-700 mb-4">Pending Bookings</h2>
            <div className="overflow-x-auto mb-6">
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
                  {pendingBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 border-b">
                      <td className="py-3 px-4">{booking.name}</td>
                      <td className="py-3 px-4 flex items-center">
                        <CalendarIcon className="mr-2 text-yellow-500" />
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">{booking.time_duration}</td>
                      <td className="py-3 px-4"><span className="text-yellow-500">Pending</span></td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded mr-2 hover:bg-red-600"
                        >
                          <Trash2Icon className="inline mr-1" /> Delete
                        </button>
                        <Link
                          to={`/admin/convention-hall-booking/${booking._id}`}
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

            <h2 className="text-2xl font-semibold text-teal-700 mb-4">Rejected Bookings</h2>
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
                  {rejectedBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 border-b">
                      <td className="py-3 px-4">{booking.name}</td>
                      <td className="py-3 px-4 flex items-center">
                        <CalendarIcon className="mr-2 text-red-500" />
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">{booking.time_duration}</td>
                      <td className="py-3 px-4"><span className="text-red-500">Rejected</span></td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded mr-2 hover:bg-red-600"
                        >
                          <Trash2Icon className="inline mr-1" /> Delete
                        </button>
                        <Link
                          to={`/admin/convention-hall-booking/${booking._id}`}
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
          </>
        )}
      </div>
    </div>
  );
};

// Animation Styles
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