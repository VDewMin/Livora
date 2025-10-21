import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios.js";
import { CalendarIcon, ClockIcon, UsersIcon, Trash2Icon, Edit2Icon } from "lucide-react";
import toast from "react-hot-toast";

const SDConventionHallBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axiosInstance.get(`/convention-hall-bookings/${id}`);
        if (response.data && Object.keys(response.data).length > 0) {
          setBooking(response.data);
          setEditData(response.data);
        } else {
          throw new Error("Empty response");
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete booking for ${booking?.name}? This action cannot be undone.`)) return;
    try {
      await axiosInstance.delete(`/convention-hall-bookings/${id}`);
      toast.success("Booking deleted successfully");
      navigate("/convention-hall-home");
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const validateEditData = () => {
    const errors = {};
    if (!editData.name?.trim()) errors.name = "Name is required";
    if (!editData.phone_number?.trim()) errors.phone_number = "Phone number is required";
    if (!editData.apartmentNo?.trim()) errors.apartmentNo = "Apartment number is required";
    if (!editData.userId?.trim()) errors.userId = "User ID is required";
    if (!editData.number_of_guests || isNaN(Number(editData.number_of_guests)) || Number(editData.number_of_guests) <= 0)
      errors.number_of_guests = "Guests must be a positive number";
    if (!editData.time_duration || isNaN(Number(editData.time_duration)) || Number(editData.time_duration) <= 0)
      errors.time_duration = "Duration must be a positive number";
    if (!editData.date) errors.date = "Date is required";
    return errors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errors = validateEditData();
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }
    try {
      const updatedBooking = await axiosInstance.put(`/convention-hall-bookings/${id}`, editData);
      setBooking(updatedBooking.data);
      setIsEditing(false);
      toast.success("Booking updated successfully");
      navigate("/convention-hall-home", { state: { booking: updatedBooking.data } });
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-10 bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen">
        <h2 className="text-2xl font-bold text-gray-700">Booking Not Found</h2>
        <button
          onClick={() => navigate("/convention-hall-home")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-10">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
        <h2 className="text-3xl font-bold text-indigo-800 mb-6 flex items-center">
          <CalendarIcon className="mr-2 text-indigo-600" />
          Booking Details
        </h2>
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={editData.name || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={editData.phone_number || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Apartment Number</label>
              <input
                type="text"
                name="apartmentNo"
                value={editData.apartmentNo || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">User ID</label>
              <input
                type="text"
                name="userId"
                value={editData.userId || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Number of Guests</label>
              <input
                type="number"
                name="number_of_guests"
                value={editData.number_of_guests || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block mb-1">Time Duration (hours)</label>
              <input
                type="number"
                name="time_duration"
                value={editData.time_duration || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={editData.date ? new Date(editData.date).toISOString().split("T")[0] : ""}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Purpose</label>
              <input
                type="text"
                name="purpose"
                value={editData.purpose || ""}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Name:</strong> {booking.name}
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> {booking.phone_number}
                </p>
                <p className="text-gray-700">
                  <strong>Apartment #:</strong> {booking.apartmentNo}
                </p>
                <p className="text-gray-700">
                  <strong>User ID:</strong> {booking.userId}
                </p>
                <p className="text-gray-700">
                  <strong>Guests:</strong> {booking.number_of_guests}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 flex items-center">
                  <ClockIcon className="mr-2 text-indigo-600" />
                  <strong>Duration:</strong> {booking.time_duration} hours
                </p>
                <p className="text-gray-700 flex items-center">
                  <CalendarIcon className="mr-2 text-indigo-600" />
                  <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <strong>Purpose:</strong> {booking.purpose || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong>Status:</strong>
                  <span
                    className={
                      booking.status === "rejected"
                        ? "text-red-600"
                        : booking.status === "pending"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }
                  >
                    {booking.status}
                  </span>
                  {booking.status === "rejected" && booking.rejection_reason && (
                    <span className="ml-2 text-sm text-red-500">({booking.rejection_reason})</span>
                  )}
                </p>
                <p className="text-gray-700">
                  <strong>Cost (LKR):</strong> {booking.total_cost?.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-lg">
              <strong>Note:</strong> Please arrive 15 minutes before your scheduled time. For any changes, contact support.
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => navigate("/convention-hall-home", { state: { booking } })}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Back to Home
              </button>
              <div className="space-x-4">
                <button
                  onClick={handleEdit}
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  <Edit2Icon className="mr-2" /> Edit Booking
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  <Trash2Icon className="mr-2" /> Delete Booking
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SDConventionHallBookingDetails;