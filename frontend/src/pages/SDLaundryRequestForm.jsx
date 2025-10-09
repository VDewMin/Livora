import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios.js';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const SDLaundryRequestForm = () => {
  const [formData, setFormData] = useState({
    resident_name: '',
    resident_id: '',
    weight: '',
    service_type: 'silver',
    time_duration: '',
    total_cost: 0, // Still used for display, but not sent
  });
  const navigate = useNavigate();

  const calculateCost = (weight, service_type) => {
    const baseRate = service_type === 'silver' ? 100 : 150; // LKR per kg
    const numericWeight = Number(weight) || 0; // Default to 0 if invalid
    return numericWeight * baseRate;
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === 'weight' || name === 'service_type') {
        newData.total_cost = calculateCost(newData.weight, newData.service_type);
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all required fields
    if (!formData.resident_name.trim() || !formData.resident_id.trim() || !formData.weight || !formData.time_duration) {
      toast.error('Please fill all required fields (Name, ID, Weight, Duration)');
      return;
    }

    try {
      console.log('Submitting data:', {
        resident_name: formData.resident_name,
        resident_id: formData.resident_id,
        weight: Number(formData.weight),
        service_type: formData.service_type,
        time_duration: Number(formData.time_duration),
      }); // Log data for debugging
      const response = await axiosInstance.post('/laundry', {
        resident_name: formData.resident_name,
        resident_id: formData.resident_id,
        weight: Number(formData.weight),
        service_type: formData.service_type,
        time_duration: Number(formData.time_duration),
        // Omit total_cost, let server calculate if needed
      });
      toast.success('Request submitted successfully!');
      navigate(`/laundry/staff`); // Use relative path
    } catch (error) {
      console.error('Error submitting request:', error.response?.data || error.message);
      toast.error(`Failed to submit request: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200 py-10">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
       
      


        <h2 className="text-2xl font-bold text-teal-800 mb-4">Laundry Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Resident Name</label>
            <input
              type="text"
              name="resident_name"
              value={formData.resident_name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Resident ID</label>
            <input
              type="text"
              name="resident_id"
              value={formData.resident_id}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="input input-bordered w-full"
              min="0.1"
              step="0.1"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Service Type</label>
            <select
              name="service_type"
              value={formData.service_type}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="silver">Silver (Wash & Dry)</option>
              <option value="premium">Premium (Wash, Dry, Iron)</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Time Duration (hours)</label>
            <input
              type="number"
              name="time_duration"
              value={formData.time_duration}
              onChange={handleChange}
              className="input input-bordered w-full"
              min="1"
              required
            />
          </div>
          <div>
            <p className="text-lg"><strong>Total Cost (LKR):</strong> {formData.total_cost?.toLocaleString() || '0'}</p>
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default SDLaundryRequestForm;