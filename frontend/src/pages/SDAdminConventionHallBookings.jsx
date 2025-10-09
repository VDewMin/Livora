import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../lib/axios.js';
import { CalendarIcon, Trash2Icon } from 'lucide-react'; // Updated to include Trash2Icon
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200 py-10">
      <div className="max-w-6xl mx-auto p-6">
        {/* Small Navbar */}
        <nav className="bg-teal-700 text-white p-2 mb-6 rounded-lg shadow-md">
          <ul className="flex justify-around">
            <li>
              <Link
                to="/admin/convention-hall-bookings"
                className="px-4 py-2 rounded hover:bg-teal-600 transition-all"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} // Active state highlight
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