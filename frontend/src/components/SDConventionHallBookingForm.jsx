import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router'; // Corrected import
import axiosInstance from '../lib/axios.js';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, UsersIcon } from 'lucide-react';


const SDConventionHallBookingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    apartment_room_number: '',
    number_of_guests: '',
    time_duration: '',
    date: new Date().toISOString().split('T')[0],
    purpose: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
    if (!formData.apartment_room_number.trim()) newErrors.apartment_room_number = 'Apartment room number is required';
    if (!formData.number_of_guests || isNaN(Number(formData.number_of_guests)) || Number(formData.number_of_guests) <= 0)
      newErrors.number_of_guests = 'Number of guests must be a positive number';
    if (!formData.time_duration || isNaN(Number(formData.time_duration)) || Number(formData.time_duration) <= 0)
      newErrors.time_duration = 'Time duration must be a positive number';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }
    setLoading(true);
    try {
      console.log('Submitting data:', formData);
      const response = await axiosInstance.post('/convention-hall-bookings', formData);
      console.log('Response:', response.data);
      toast.success('Booking created successfully');
      navigate('/convention-hall-home', { state: { booking: response.data } });
    } catch (error) {
      console.error('Error creating booking:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-3 py-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/convention-hall-home" className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Home
          </Link>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-3xl mb-6">
                <CalendarIcon className="inline mr-2 text-teal-500" /> Book Convention Hall
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Booking Information Section */}
                <div className="divider">Booking Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Name </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    {errors.name && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.name}</span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone Number </span>
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      placeholder="+94 123 456 789"
                      className={`input input-bordered w-full ${errors.phone_number ? 'input-error' : ''}`}
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    {errors.phone_number && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.phone_number}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Apartment Room Number </span>
                    </label>
                    <input
                      type="text"
                      name="apartment_room_number"
                      placeholder="e.g., A101"
                      className={`input input-bordered w-full ${errors.apartment_room_number ? 'input-error' : ''}`}
                      value={formData.apartment_room_number}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    {errors.apartment_room_number && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.apartment_room_number}</span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Number of Guests </span>
                    </label>
                    <input
                      type="number"
                      name="number_of_guests"
                      placeholder="e.g., 10"
                      className={`input input-bordered w-full ${errors.number_of_guests ? 'input-error' : ''}`}
                      value={formData.number_of_guests}
                      onChange={handleInputChange}
                      min="1"
                      disabled={loading}
                    />
                    {errors.number_of_guests && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.number_of_guests}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Time Duration (hours) </span>
                    </label>
                    <input
                      type="number"
                      name="time_duration"
                      placeholder="e.g., 2"
                      className={`input input-bordered w-full ${errors.time_duration ? 'input-error' : ''}`}
                      value={formData.time_duration}
                      onChange={handleInputChange}
                      min="1"
                      disabled={loading}
                    />
                    {errors.time_duration && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.time_duration}</span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date </span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      className={`input input-bordered w-full ${errors.date ? 'input-error' : ''}`}
                      value={formData.date}
                      onChange={handleInputChange}
                      disabled={loading}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.date && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.date}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Purpose</span>
                  </label>
                  <textarea
                    name="purpose"
                    className={`textarea textarea-bordered h-24 ${errors.purpose ? 'textarea-error' : ''}`}
                    placeholder="Enter the purpose of the booking (e.g., event, meeting)"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  {errors.purpose && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.purpose}</span>
                    </label>
                  )}
                </div>

                {/* Form Actions */}
                <div className="card-actions justify-end gap-4">
                  <Link to="/convention-hall-home" className="btn btn-ghost">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Creating Booking...
                      </>
                    ) : (
                      'Book Hall'
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

export default SDConventionHallBookingForm;