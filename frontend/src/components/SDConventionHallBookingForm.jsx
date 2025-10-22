
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import { ArrowLeftIcon, CalendarIcon, ClockIcon, UsersIcon } from "lucide-react";
import { useAuth } from "../context/vd_AuthContext";

const SDConventionHallBookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    apartmentNo: "",
    userId: "",
    number_of_guests: "",
    time_duration: "",
    date: new Date().toISOString().split("T")[0],
    purpose: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get("/convention-hall-bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load availability");
      }
    };
    fetchBookings();

    // Auto-populate from navigation state or auth context
    const state = location.state || {};
    const user = state.user || authUser;
    if (user && user._id && user.firstName && user.lastName && user.phoneNo && user.apartmentNo) {
      setFormData((prev) => ({
        ...prev,
        name: `${user.firstName} ${user.lastName}`.trim(),
        userId: user.userId,
        phone_number: user.phoneNo,
        apartmentNo: user.apartmentNo,
      }));
    }
  }, [location.state, authUser]);

  useEffect(() => {
    const initializeCalendar = () => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/fullcalendar@5.11.0/main.min.js";
      script.onload = () => {
        const calendarEl = document.getElementById("calendar");
        if (calendarEl && window.FullCalendar) {
          let calendar = new window.FullCalendar.Calendar(calendarEl, {
            initialView: "dayGridMonth",
            headerToolbar: {
              left: "prev,next",
              center: "title",
              right: "",
            },
            events: bookings
              .filter((b) => ["accepted", "pending"].includes(b.status))
              .map((b) => ({
                title: b.status,
                start: b.date,
                end: new Date(new Date(b.date).setHours(new Date(b.date).getHours() + Number(b.time_duration))),
                backgroundColor: b.status === "accepted" ? "#10B981" : "#FBBF24",
                borderColor: b.status === "accepted" ? "#10B981" : "#FBBF24",
                textColor: "#FFFFFF",
                extendedProps: { name: b.name },
              })),
            eventDidMount: (info) => {
              const tooltip = document.createElement("div");
              tooltip.className = "tooltip";
              tooltip.innerHTML = `<div><strong>Name:</strong> ${info.event.extendedProps.name}</div><div><strong>Date:</strong> ${new Date(info.event.start).toLocaleDateString()}</div>`;
              info.el.appendChild(tooltip);

              info.el.addEventListener("mouseenter", () => {
                tooltip.style.display = "block";
                tooltip.style.position = "absolute";
                tooltip.style.background = "#fff";
                tooltip.style.border = "1px solid #e5e7eb";
                tooltip.style.padding = "5px";
                tooltip.style.borderRadius = "4px";
                tooltip.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                tooltip.style.zIndex = "1000";
                tooltip.style.left = "50%";
                tooltip.style.transform = "translateX(-50%)";
                tooltip.style.top = "-30px";
              });
              info.el.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
              });
            },
            dateClick: (info) => {
              const clickedDate = info.dateStr;
              const isBooked = bookings.some((b) => {
                const bookingDate = new Date(b.date).toISOString().split("T")[0];
                return bookingDate === clickedDate && ["accepted", "pending"].includes(b.status);
              });
              toast(isBooked ? "This date is booked" : "This date is available");
            },
            validRange: {
              start: new Date().toISOString().split("T")[0],
            },
            height: "300px",
            contentHeight: "auto",
            eventTextColor: "#FFFFFF",
          });
          calendar.render();
          return () => {
            if (calendar) calendar.destroy();
          };
        }
      };
      document.head.appendChild(script);

      const link = document.createElement("link");
      link.href = "https://cdn.jsdelivr.net/npm/fullcalendar@5.11.0/main.min.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(script);
        document.head.removeChild(link);
      };
    };

    const cleanup = initializeCalendar();
    return cleanup;
  }, [bookings]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone_number.trim()) newErrors.phone_number = "Phone number is required";
    if (!formData.apartmentNo.trim()) newErrors.apartmentNo = "Apartment number is required";
    if (!formData.userId.trim()) newErrors.userId = "User ID is required";
    if (!formData.number_of_guests || isNaN(Number(formData.number_of_guests)) || Number(formData.number_of_guests) <= 0)
      newErrors.number_of_guests = "Number of guests must be a positive number";
    if (!formData.time_duration || isNaN(Number(formData.time_duration)) || Number(formData.time_duration) <= 0)
      newErrors.time_duration = "Time duration must be a positive number";
    if (!formData.date) newErrors.date = "Date is required";
    const selectedDate = new Date(formData.date);
    const isBooked = bookings.some((b) => {
      const bookingDate = new Date(b.date);
      return bookingDate.toDateString() === selectedDate.toDateString() && ["accepted", "pending"].includes(b.status);
    });
    if (isBooked) newErrors.date = "This date is already booked";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post("/convention-hall-bookings", formData);
      toast.success("Booking created successfully");
      navigate("/convention-hall-home", { state: { booking: response.data } });
    } catch (error) {
      console.error("Error creating booking:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200 animate-fade-in">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/convention-hall-home"
            className="btn btn-ghost mb-8 text-teal-700 hover:bg-teal-100 transition-all"
          >
            <ArrowLeftIcon className="h-6 w-6 mr-2" /> Back to Home
          </Link>

          <div className="card bg-white shadow-2xl rounded-lg border-l-4 border-teal-500 overflow-hidden transform transition-all hover:scale-101">
            <div className="card-body p-6">
              <h2 className="card-title text-4xl font-bold mb-6 text-teal-700 flex items-center">
                <CalendarIcon className="h-8 w-8 mr-2 text-teal-500" /> Book Convention Hall
              </h2>

              <div id="calendar" className="mb-8 bg-white border border-teal-200 rounded-lg shadow-md"></div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="divider text-teal-600 font-semibold">Booking Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label text-teal-700">
                      <span className="label-text font-medium">Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className={`input input-bordered w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all ${
                        errors.name ? "input-error" : ""
                      }`}
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={loading}
                      readOnly
                    />
                    {errors.name && (
                      <label className="label">
                        <span className="label-text-alt text-red-500">{errors.name}</span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label text-teal-700">
                      <span className="label-text font-medium">Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      placeholder="+94 123 456 789"
                      className={`input input-bordered w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all ${
                        errors.phone_number ? "input-error" : ""
                      }`}
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      disabled={loading}
                      readOnly
                    />
                    {errors.phone_number && (
                      <label className="label">
                        <span className="label-text-alt text-red-500">{errors.phone_number}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label text-teal-700">
                      <span className="label-text font-medium">Apartment Number</span>
                    </label>
                    <input
                      type="text"
                      name="apartmentNo"
                      placeholder="e.g., P101"
                      className={`input input-bordered w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all ${
                        errors.apartmentNo ? "input-error" : ""
                      }`}
                      value={formData.apartmentNo}
                      onChange={handleInputChange}
                      disabled={loading}
                      readOnly
                    />
                    {errors.apartmentNo && (
                      <label className="label">
                        <span className="label-text-alt text-red-500">{errors.apartmentNo}</span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label text-teal-700">
                      <span className="label-text font-medium">User ID</span>
                    </label>
                    <input
                      type="text"
                      name="userId"
                      placeholder="Enter your user ID"
                      className={`input input-bordered w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all ${
                        errors.userId ? "input-error" : ""
                      }`}
                      value={formData.userId}
                      onChange={handleInputChange}
                      disabled={loading}
                      readOnly
                    />
                    {errors.userId && (
                      <label className="label">
                        <span className="label-text-alt text-red-500">{errors.userId}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label text-teal-700">
                      <span className="label-text font-medium">Number of Guests</span>
                    </label>
                    <input
                      type="number"
                      name="number_of_guests"
                      placeholder="e.g., 10"
                      className={`input input-bordered w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all ${
                        errors.number_of_guests ? "input-error" : ""
                      }`}
                      value={formData.number_of_guests}
                      onChange={handleInputChange}
                      min="1"
                      disabled={loading}
                    />
                    {errors.number_of_guests && (
                      <label className="label">
                        <span className="label-text-alt text-red-500">{errors.number_of_guests}</span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label text-teal-700">
                      <span className="label-text font-medium">Time Duration (hours)</span>
                    </label>
                    <input
                      type="number"
                      name="time_duration"
                      placeholder="e.g., 2"
                      className={`input input-bordered w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all ${
                        errors.time_duration ? "input-error" : ""
                      }`}
                      value={formData.time_duration}
                      onChange={handleInputChange}
                      min="1"
                      disabled={loading}
                    />
                    {errors.time_duration && (
                      <label className="label">
                        <span className="label-text-alt text-red-500">{errors.time_duration}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label text-teal-700">
                      <span className="label-text font-medium">Date</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      className={`input input-bordered w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all ${
                        errors.date ? "input-error" : ""
                      }`}
                      value={formData.date}
                      onChange={handleInputChange}
                      disabled={loading}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.date && (
                      <label className="label">
                        <span className="label-text-alt text-red-500">{errors.date}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label text-teal-700">
                    <span className="label-text font-medium">Purpose</span>
                  </label>
                  <textarea
                    name="purpose"
                    className={`textarea textarea-bordered h-32 w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all ${
                      errors.purpose ? "textarea-error" : ""
                    }`}
                    placeholder="Enter the purpose of the booking (e.g., event, meeting)"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  {errors.purpose && (
                    <label className="label">
                      <span className="label-text-alt text-red-500">{errors.purpose}</span>
                    </label>
                  )}
                </div>

                <div className="card-actions flex justify-end gap-10 mt-6">
                  <Link
                    to="/convention-hall-home"
                    className="btn btn-ghost text-teal-700 hover:bg-teal-100 transition-all px-2 py-3 rounded-full flex items-center"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary bg-teal-600 text-white hover:bg-teal-700 transition-all hover:scale-75 border-0 px-4 py-3 rounded-full flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Creating Booking...
                      </>
                    ) : (
                      "Book Hall"
                    )}
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

// Animation and Calendar Styles
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 1s ease-out;
  }
  #calendar {
    height: 300px;
    margin-bottom: 20px;
  }
  .tooltip {
    display: none;
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border: 1px solid #e5e7eb;
    padding: 5px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 1000;
    white-space: nowrap;
  }
`;
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default SDConventionHallBookingForm;
