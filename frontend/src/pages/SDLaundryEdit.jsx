import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios.js';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, ClockIcon } from 'lucide-react';

const SDLaundryEdit = () => {
  const { schedule_id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    resident_name: '',
    resident_id: '',
    weight: '',
    service_type: 'silver',
    time_duration: '',
    status: 'pending', // Default status
    total_cost: '0.00', // For display only
  });

  // Cost rates per service type (matching SDLaundryRequestForm)
  const serviceRates = {
    silver: 100,  
    premium: 150, 
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axiosInstance.get(`/laundry?schedule_id=${schedule_id}`);
        console.log('Fetched request data:', response.data); // Debug log
        const requestData = response.data.find(req => req.schedule_id === schedule_id) || {};
        setRequest(requestData);
        setFormData({
          resident_name: requestData.resident_name || '',
          resident_id: requestData.resident_id || '',
          weight: requestData.weight?.toString() || '',
          service_type: requestData.service_type || 'silver',
          time_duration: requestData.time_duration?.toString() || '',
          status: requestData.status || 'pending', // Set fetched status or default
          total_cost: requestData.total_cost?.toFixed(2) || '0.00',
        });
      } catch (error) {
        console.error('GET Error:', error.response?.data || error.message);
        toast.error('Failed to load request details');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [schedule_id]);

  // Auto-calculate total cost based on weight and service type (for display only)
  useEffect(() => {
    const weightNum = Number(formData.weight);
    const rate = serviceRates[formData.service_type] || 0;
    const calculatedCost = weightNum > 0 ? weightNum * rate : 0;
    setFormData((prev) => ({ ...prev, total_cost: calculatedCost.toFixed(2) }));
  }, [formData.weight, formData.service_type]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.resident_name.trim()) newErrors.resident_name = 'Resident name is required';
    if (!formData.resident_id.trim()) newErrors.resident_id = 'Resident ID is required';
    if (!formData.weight || isNaN(Number(formData.weight)) || Number(formData.weight) <= 0)
      newErrors.weight = 'Weight must be a positive number';
    if (!formData.service_type) newErrors.service_type = 'Service type is required';
    if (!formData.time_duration || isNaN(Number(formData.time_duration)) || Number(formData.time_duration) <= 0)
      newErrors.time_duration = 'Time duration must be a positive number';
    if (!formData.status) newErrors.status = 'Status is required';
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the errors below');
      return;
    }
    try {
      const payload = {
        resident_name: formData.resident_name,
        resident_id: formData.resident_id,
        weight: Number(formData.weight),
        service_type: formData.service_type,
        time_duration: Number(formData.time_duration),
        status: formData.status, 
        
      };
      const requestId = request._id; 
      if (!requestId) {
        throw new Error('Request ID not found');
      }
      console.log('Sending PUT request to:', `/laundry/${requestId}`, 'with data:', payload);
      await axiosInstance.put(`/laundry/${requestId}`, payload);
      toast.success('Request updated successfully');
      navigate('/laundry/staff');
    } catch (error) {
      console.error('PUT Error:', error.response?.data || error.message);
      toast.error(`Failed to update request: ${error.response?.data?.message || 'Server error'}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!request) {
    return (
      <div className="text-center py-10">
        <h2>Request Not Found</h2>
        <button onClick={() => navigate('/laundry/staff')} className="btn btn-secondary mt-4">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200 py-10">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-teal-800">Edit Laundry Request</h2>
          <button onClick={() => navigate('/laundry/staff')} className="btn btn-ghost text-teal-700">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="card bg-white shadow-lg p-4 rounded-lg">
          <h2 className="text-xl mb-4 text-teal-700 flex items-center">
            <ClockIcon className="h-5 w-5 mr-2 text-teal-500" /> Edit Request
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Resident Name</label>
              <input
                type="text"
                name="resident_name"
                value={formData.resident_name}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
              {validateForm().resident_name && (
                <span className="text-red-500 text-sm">{validateForm().resident_name}</span>
              )}
            </div>
            <div>
              <label className="block mb-1">Resident ID</label>
              <input
                type="text"
                name="resident_id"
                value={formData.resident_id}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
              {validateForm().resident_id && (
                <span className="text-red-500 text-sm">{validateForm().resident_id}</span>
              )}
            </div>
            <div>
              <label className="block mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                min="0.1"
                step="0.1"
                required
              />
              {validateForm().weight && (
                <span className="text-red-500 text-sm">{validateForm().weight}</span>
              )}
            </div>
            <div>
              <label className="block mb-1">Service Type</label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="silver">Silver (Wash & Dry)</option>
                <option value="premium">Premium (Wash, Dry, Iron)</option>
              </select>
              {validateForm().service_type && (
                <span className="text-red-500 text-sm">{validateForm().service_type}</span>
              )}
            </div>
            <div>
              <label className="block mb-1">Time Duration (hours)</label>
              <input
                type="number"
                name="time_duration"
                value={formData.time_duration}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                min="1"
                required
              />
              {validateForm().time_duration && (
                <span className="text-red-500 text-sm">{validateForm().time_duration}</span>
              )}
            </div>
            <div>
              <label className="block mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {validateForm().status && (
                <span className="text-red-500 text-sm">{validateForm().status}</span>
              )}
            </div>
            <div>
              <p className="text-lg"><strong>Total Cost (LKR):</strong> {formData.total_cost.toLocaleString()}</p>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SDLaundryEdit;