import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

  useEffect(() => {
    if (newBooking) {
      setBookings(prevBookings => {
        if (!prevBookings.some(b => b._id === newBooking._id)) {
          return [...prevBookings, newBooking].sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        return prevBookings;
      });
    }
  }, [newBooking]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fullcalendar@5.11.0/main.min.js';
    script.onload = () => {
      const calendarEl = document.getElementById('calendar');
      if (calendarEl && window.FullCalendar) {
        new window.FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth',
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          },
          dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          events: bookings.map(b => ({
            title: `${b.name} (${b.status})`,
            start: b.date,
            end: new Date(new Date(b.date).setHours(new Date(b.date).getHours() + Number(b.time_duration))),
            color: b.status === 'accepted' ? '#10B981' : b.status === 'pending' ? '#FBBF24' : '#EF4444',
            textColor: '#1F2937',
            extendedProps: { purpose: b.purpose || 'N/A' },
          })),
          eventDidMount: (info) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerHTML = `<div><strong>Name:</strong> ${info.event.title}</div><div><strong>Purpose:</strong> ${info.event.extendedProps.purpose}</div>`;
            info.el.appendChild(tooltip);

            info.el.addEventListener('mouseenter', () => {
              tooltip.style.display = 'block';
              tooltip.style.position = 'absolute';
              tooltip.style.background = '#fff';
              tooltip.style.border = '1px solid #e5e7eb';
              tooltip.style.padding = '5px';
              tooltip.style.borderRadius = '4px';
              tooltip.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              tooltip.style.zIndex = '1000';
              tooltip.style.left = '50%';
              tooltip.style.transform = 'translateX(-50%)';
            });
            info.el.addEventListener('mouseleave', () => {
              tooltip.style.display = 'none';
            });
          },
          dateClick: (info) => {
            const clickedDate = info.dateStr;
            const isBooked = bookings.some(b => {
              const bookingDate = new Date(b.date).toISOString().split('T')[0];
              return bookingDate === clickedDate && b.status !== 'rejected';
            });
            toast(isBooked ? 'This date is booked' : 'This date is available');
          },
          height: '600px',
          contentHeight: 'auto',
          aspectRatio: 1.5,
          eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short',
          },
        }).render();
      }
    };
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/fullcalendar@5.11.0/main.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(link);
    };
  }, [bookings]);

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
        <div
          id="calendar"
          className="mb-8 bg-white rounded-xl shadow-xl border border-teal-200 p-4 transition-all duration-300 hover:shadow-2xl"
        ></div>
        {newBooking && (
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-200">
            <h2 className="text-2xl font-semibold text-teal-700 mb-4 flex items-center">
              <CalendarIcon className="mr-2 text-green-500" /> New Booking Details
            </h2>
            <p className="text-gray-600"><strong>Name:</strong> {newBooking.name}</p>
            <p className="text-gray-600"><strong>Apartment No:</strong> {newBooking.apartmentNo}</p>
            <p className="text-gray-600"><strong>User ID:</strong> {newBooking.userId}</p>
            <p className="text-gray-600 flex items-center">
              <ClockIcon className="mr-2 text-green-500" />
              <strong>Duration:</strong> {newBooking.time_duration} hours
            </p>
            <p className="text-gray-600 flex items-center">
              <UsersIcon className="mr-2 text-green-500" />
              <strong>Guests:</strong> {newBooking.number_of_guests}
            </p>
            <p className="text-gray-600"><strong>Purpose:</strong> {newBooking.purpose || 'N/A'}</p>
            <p className="text-gray-600"><strong>Date:</strong> {new Date(newBooking.date).toLocaleDateString()}</p>
            <p className="text-gray-600"><strong>Status:</strong> <span className="text-green-500">{newBooking.status}</span></p>
            <Link
              to={`/convention-hall-booking/${newBooking._id}`}
              className="mt-4 inline-block bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-200"
            >
              View Details
            </Link>
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

// Animation Styles
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
  #calendar {
    height: 600px;
    margin-bottom: 20px;
  }
  .tooltip {
    display: none;
    position: absolute;
    top: -40px;
    white-space: nowrap;
  }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default SDConventionHallHomePage;