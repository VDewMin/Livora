import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import axiosInstance from '../lib/axios.js';
import { CalendarIcon, ClockIcon, UsersIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const SDConventionHallHomePage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const newBooking = location.state?.booking;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get('/convention-hall-bookings');
        console.log('API Response:', response.data); // Debug the raw data
       //  Replace 'A101' with dynamic resident ID (e.g., from auth context)
        const residentId = 'A101'; // Placeholder; replace with actual resident ID
       const residentBookings = response.data.filter(b => b.apartment_room_number === residentId);
      setBookings(residentBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    // Integrate new booking into state if present
    if (newBooking) {
      setBookings(prevBookings => {
        if (!prevBookings.some(b => b._id === newBooking._id)) {
          return [...prevBookings, newBooking];
        }
        return prevBookings;
      });
    }
  }, [newBooking]);

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
          Welcome to Pearl Residencies Convention Hall
        </h1>
        {newBooking && (
          <div className="bg-green-100 p-4 rounded-lg mb-6 text-center animate-pulse">
            <p className="text-lg text-green-800"><strong>New Booking Confirmed!</strong></p>
            <p className="text-gray-700">Name: {newBooking.name}, Date: {new Date(newBooking.date).toLocaleDateString()}</p>
            <p className="text-gray-700"><strong>Status:</strong> {newBooking.status}</p>
          </div>
        )}
        {bookings.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No bookings yet. Book your hall now!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-teal-200"
              >
                <h3 className="text-xl font-semibold text-teal-700 mb-2 flex items-center">
                  <CalendarIcon className="mr-2 text-teal-500" />
                  {new Date(booking.date).toLocaleDateString()}
                </h3>
                <p className="text-gray-600"><strong>Name:</strong> {booking.name}</p>
                <p className="text-gray-600 flex items-center">
                  <ClockIcon className="mr-2 text-teal-500" />
                  <strong>Duration:</strong> {booking.time_duration} hours
                </p>
                <p className="text-gray-600 flex items-center">
                  <UsersIcon className="mr-2 text-teal-500" />
                  <strong>Guests:</strong> {booking.number_of_guests}
                </p>
                <p className="text-gray-600"><strong>Purpose:</strong> {booking.purpose || 'N/A'}</p>
                <p className="text-gray-600">
                  <strong>Status:</strong>
                  <span
                    className={booking.status === 'rejected' ? 'text-red-500' : booking.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}
                  >
                    {booking.status}
                  </span>
                </p>
                <p className="text-gray-600"><strong>Cost (LKR):</strong> {booking.total_cost?.toLocaleString()}</p>
                <Link
                  to={`convention-hall-booking/${booking._id}`}
                  className="mt-4 inline-block bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-200"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link
            to="/convention-hall-bookings"
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition duration-200 text-lg font-semibold"
          >
            Book a New Hall
          </Link>
        </div>
      </div>
    </div>
  );
};

// Simple fade-in and pulse animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  .animate-fade-in {
    animation: fadeIn 1s ease-in;
  }
  .animate-pulse {
    animation: pulse 1.5s infinite;
  }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default SDConventionHallHomePage;