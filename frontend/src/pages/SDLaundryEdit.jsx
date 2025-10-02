import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios.js';
import toast from 'react-hot-toast';
import { ArrowLeftIcon, ClockIcon, UsersIcon } from 'lucide-react';

const SDLaundryEdit = () => {
  const { schedule_id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    weight: '',
    service_type: '',
    time_duration: '',
    status: '',
    total_cost: '',
  });

  // Cost rates per service type (example rates in LKR per kg)
  const serviceRates = {
    wash: 5,
    'dry-clean': 10,
    iron: 3,
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axiosInstance.get(`/laundry/schedule/${schedule_id}`);
        setRequest(response.data);
        setFormData({
          weight: response.data.weight,
          service_type: response.data.service_type,
          time_duration: response.data.time_duration,
          status: response.data.status,
          total_cost: response.data.total_cost,
        });
      } catch (error) {
        toast.error('Failed to load request details');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [schedule_id]);

  // Auto-calculate total cost based on weight and service type
  useEffect(() => {
    const weightNum = Number(formData.weight);
    const rate = serviceRates[formData.service_type] || 0;
    const calculatedCost = weightNum > 0 ? weightNum * rate : 0;
    setFormData((prev) => ({ ...prev, total_cost: calculatedCost.toFixed(2) }));
  }, [formData.weight, formData.service_type]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.weight || isNaN(Number(formData.weight)) || Number(formData.weight) <= 0)
      newErrors.weight = 'Weight must be a positive number';
    if (!formData.service_type.trim()) newErrors.service_type = 'Service type is required';
    if (!formData.time_duration || isNaN(Number(formData.time_duration)) || Number(formData.time_duration) <= 0)
      newErrors.time_duration = 'Time duration must be a positive number';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.total_cost || isNaN(Number(formData.total_cost)) || Number(formData.total_cost) < 0)
      newErrors.total_cost = 'Total cost must be a non-negative number';
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the errors below');
      return;
    }
    try {
      console.log('Sending PUT request to:', `/laundry/schedule/${schedule_id}`, 'with data:', formData); // Debug log
      await axiosInstance.put(`/laundry/schedule/${schedule_id}`, formData);
      toast.success('Request updated successfully');
      navigate('/laundry/staff');
    } catch (error) {
      console.error('PUT Error:', error.response?.data || error.message); // Detailed error log
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
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-lg shadow-lg border-l-4 border-teal-500">
            <h2 className="text-2xl font-bold text-teal-800">Edit Laundry Request</h2>
            <button onClick={() => navigate('/laundry/staff')} className="btn btn-ghost text-teal-700">
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="card bg-white shadow-xl rounded-lg border-l-4 border-teal-500 overflow-hidden">
            <div className="card-body p-6">
              <h2 className="card-title text-3xl mb-6 text-teal-700 flex items-center">
                <ClockIcon className="h-6 w-6 mr-2 text-teal-500" /> Edit Request
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="divider text-teal-600 font-semibold">Request Details</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label text-teal-700">
                      <span className="label-text font-medium">Weight (kg)</span>
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className={`input input-bordered w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 ${validateForm().weight ? 'input-error' : ''}`}
                      min="0.1"
                      step="0.1"
                    />
                    {validateForm().weight && (
                      <label className="label">
                        <span className="label-text-alt text-red-500">{validateForm().weight}</span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label text-teal-700">
                      <span className="label-text font-medium">Service Type</span>
                    </label>
                    <select
                      name="service_type"
                      value={formData.service_type}
                      onChange={handleInputChange}
                      className={`select select-bordered w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 ${validateForm().service_type ? 'select-error' : ''}`}
                    >
                      <option value="">Select Service</option>
                      <option value="wash">Wash</option>
                      <option value="dry-clean">Dry Clean</option>
                      <option value="iron">Iron</option>
                    </select>
                    {validateForm().service_type && (
                      <label className="label">
                        <span className="label-text-alt text-red-500">{validateForm().service_type}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label text-teal-700">
                      <span className="label-text font-medium">Time Duration (hours)</span>
                    </label>
                    <input
                      type="number"
                      name="time_duration"
                      value={formData.time_duration}
                      onChange={handleInputChange}
                      className={`input input-bordered w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 ${validateForm().time_duration ? 'input-error' : ''}`}
                      min="1"
                    />
                    {validateForm().time_duration && (
                      <label className="label">
                        <span className="label-text-alt text-red-500">{validateForm().time_duration}</span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label text-teal-700">
                      <span className="label-text font-medium">Status</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className={`select select-bordered w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 ${validateForm().status ? 'select-error' : ''}`}
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {validateForm().status && (
                      <label className="label">
                        <span className="label-text-alt text-red-500">{validateForm().status}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label text-teal-700">
                    <span className="label-text font-medium">Total Cost (LKR)</span>
                  </label>
                  <input
                    type="number"
                    name="total_cost"
                    value={formData.total_cost}
                    readOnly
                    className="input input-bordered w-full border-teal-300 bg-teal-50"
                  />
                  {validateForm().total_cost && (
                    <label className="label">
                      <span className="label-text-alt text-red-500">{validateForm().total_cost}</span>
                    </label>
                  )}
                </div>

                <div className="card-actions justify-end gap-4 mt-6">
                  <button type="submit" className="btn btn-primary bg-teal-600 text-white hover:bg-teal-700">
                    Save Changes
                  </button>
                  <button onClick={() => navigate('/laundry/staff')} className="btn btn-secondary">
                    Cancel
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

export default SDLaundryEdit;