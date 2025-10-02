import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios.js';
import { formatCurrency, formatDate } from '../lib/utils.js';

const SDcreatepurchase = () => {
    // Form state
    const [formData, setFormData] = useState({
        buyer_Name: '',
        buyer_id: '',
        buyer_Email: '',
        buyer_Phone: '',
        room_id: '',
        room_type: '',
        price: '',
        purchase_date: '',
        content: '',
        // Rental-specific fields 
        lease_duration: '',
        lease_start_date: '',
        lease_end_date: '',
        security_deposit: '',
        monthly_rent: ''
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showDurationFields, setShowDurationFields] = useState(false);

    const navigate = useNavigate();

    // Update validation to handle conditional fields
    const validateForm = () => {
        const newErrors = {};
        if (!formData.buyer_Name.trim()) newErrors.buyer_Name = 'Buyer name is required';
        if (!formData.buyer_id.trim()) newErrors.buyer_id = 'Buyer ID is required';
        if (!formData.buyer_Email.trim()) newErrors.buyer_Email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(formData.buyer_Email)) newErrors.buyer_Email = 'Please enter a valid email';
        if (!formData.buyer_Phone.trim()) newErrors.buyer_Phone = 'Phone number is required';
        if (!formData.room_id.trim()) newErrors.room_id = 'Room ID is required';
        if (!formData.room_type.trim()) newErrors.room_type = 'Room type is required';
        if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) newErrors.price = 'Price must be a positive number';
        if (!formData.purchase_date) newErrors.purchase_date = 'Purchase date is required';

        if (formData.room_type === 'rent') {
            if (!formData.lease_duration) newErrors.lease_duration = 'Lease duration is required for rentals';
            if (!formData.lease_start_date) newErrors.lease_start_date = 'Lease start date is required';
            if (!formData.security_deposit || isNaN(Number(formData.security_deposit)) || Number(formData.security_deposit) < 0) {
                newErrors.security_deposit = 'Security deposit must be a valid number';
            }
        }

        if (!formData.content.trim()) newErrors.content = 'Content is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            
            // Auto-set monthly rent based on lease duration when room_type is 'rent'
            if (name === 'lease_duration' && newData.room_type === 'rent') {
                let rent = '';
                switch (value) {
                    case '6_months': rent = '20000'; break;
                    case '12_months': rent = '15000'; break;
                    case '24_months': rent = '10000'; break;
                    default: rent = ''; // Custom or empty
                }
                newData.monthly_rent = rent;
            }

            // Show/hide duration fields based on room_type
            if (name === 'room_type') {
                setShowDurationFields(value === 'rent');
                if (value !== 'rent') {
                    newData.lease_duration = '';
                    newData.lease_start_date = '';
                    newData.lease_end_date = '';
                    newData.security_deposit = '';
                    newData.monthly_rent = '';
                    setErrors(prev => {
                        const { lease_duration, lease_start_date, security_deposit, ...rest } = prev;
                        return rest;
                    });
                }
            }

            // Clear error when user starts typing
            if (errors[name]) {
                setErrors(prev => ({ ...prev, [name]: '' }));
            }
            return newData;
        });
    };

    // Calculate end date based on start date and duration
    const calculateEndDate = () => {
        if (!formData.lease_start_date || !formData.lease_duration) return '';
        const startDate = new Date(formData.lease_start_date);
        let monthsToAdd;
        switch (formData.lease_duration) {
            case '6_months': monthsToAdd = 6; break;
            case '12_months': monthsToAdd = 12; break;
            case '24_months': monthsToAdd = 24; break;
            default: return '';
        }
        startDate.setMonth(startDate.getMonth() + monthsToAdd);
        return startDate.toISOString().split('T')[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors below');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                buyer_Name: formData.buyer_Name,
                buyer_id: formData.buyer_id,
                buyer_Email: formData.buyer_Email,
                buyer_Phone: formData.buyer_Phone,
                room_id: formData.room_id,
                room_type: formData.room_type,
                price: Number(formData.price),
                purchase_date: formData.purchase_date,
                content: formData.content
            };

            if (formData.room_type === 'rent') {
                payload.lease_duration = formData.lease_duration;
                payload.lease_start_date = formData.lease_start_date;
                payload.lease_end_date = formData.lease_end_date || calculateEndDate();
                payload.security_deposit = Number(formData.security_deposit) || 0;
                payload.monthly_rent = Number(formData.monthly_rent) || 0;
            }

            console.log('Submitting payload:', payload);
            console.log('room_type:', formData.room_type);
            console.log('All rental fields:', {
                lease_duration: formData.lease_duration,
                lease_start_date: formData.lease_start_date,
                lease_end_date: formData.lease_end_date,
                security_deposit: formData.security_deposit,
                monthly_rent: formData.monthly_rent
            });
            console.log('Full payload:', payload);

            await api.post('/purchases', payload);

            const successMessage = formData.room_type === 'rent' 
                ? 'Rental agreement created successfully' 
                : 'Purchase created successfully';
            
            toast.success(successMessage);
            navigate('/purchases');
        } catch (error) {
            console.error('Error creating purchase:', error);
            toast.error('Failed to create purchase. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const roomTypeOptions = [
        { value: 'rent', label: 'Rent', hasDuration: true },
        { value: 'sale', label: 'Permanent', hasDuration: false },
    ];

    const durationOptions = [
        { value: '6_months', label: '6 Months' },
        { value: '12_months', label: '12 Months' },
        { value: '24_months', label: '24 Months' },
        { value: 'custom', label: 'Custom Duration' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200 flex items-center justify-center py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <Link to="/purchases" className="btn btn-ghost mb-6 flex items-center text-teal-800 hover:text-teal-600">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Purchases
                    </Link>

                    <div className="card bg-white shadow-xl rounded-lg overflow-hidden border border-teal-200">
                        <div className="card-body p-6">
                            <h2 className="card-title text-3xl font-bold text-teal-800 mb-6 text-center bg-teal-50 p-4 rounded-t-lg">
                                Create New Purchase Agreement
                            </h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Buyer Information Section */}
                                <div className="divider text-teal-700 font-semibold">Buyer Information</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                                        <label className="label text-lg font-semibold text-teal-700 block mb-2">
                                            <span className="label-text">Buyer Name </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="buyer_Name"
                                            placeholder="Enter buyer full name"
                                            className={`input input-bordered w-full bg-white ${errors.buyer_Name ? 'input-error' : ''} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all`}
                                            value={formData.buyer_Name}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                        {errors.buyer_Name && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.buyer_Name}</span>
                                            </label>
                                        )}
                                    </div>

                                    <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                                        <label className="label text-lg font-semibold text-teal-700 block mb-2">
                                            <span className="label-text">Buyer ID </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="buyer_id"
                                            placeholder="Enter buyer ID"
                                            className={`input input-bordered w-full bg-white ${errors.buyer_id ? 'input-error' : ''} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all`}
                                            value={formData.buyer_id}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                        {errors.buyer_id && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.buyer_id}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                                        <label className="label text-lg font-semibold text-teal-700 block mb-2">
                                            <span className="label-text">Email Address *</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="buyer_Email"
                                            placeholder="buyer@example.com"
                                            className={`input input-bordered w-full bg-white ${errors.buyer_Email ? 'input-error' : ''} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all`}
                                            value={formData.buyer_Email}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                        {errors.buyer_Email && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.buyer_Email}</span>
                                            </label>
                                        )}
                                    </div>

                                    <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                                        <label className="label text-lg font-semibold text-teal-700 block mb-2">
                                            <span className="label-text">Phone Number *</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="buyer_Phone"
                                            placeholder="+94 123 456 789"
                                            className={`input input-bordered w-full bg-white ${errors.buyer_Phone ? 'input-error' : ''} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all`}
                                            value={formData.buyer_Phone}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                        {errors.buyer_Phone && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.buyer_Phone}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Apartment Details Section */}
                                <div className="divider text-teal-700 font-semibold">Apartment Details</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                                        <label className="label text-lg font-semibold text-teal-700 block mb-2">
                                            <span className="label-text">Room No</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="room_id"
                                            placeholder="APT-123"
                                            className={`input input-bordered w-full bg-white ${errors.room_id ? 'input-error' : ''} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all`}
                                            value={formData.room_id}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                        {errors.room_id && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.room_id}</span>
                                            </label>
                                        )}
                                    </div>

                                    <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                                        <label className="label text-lg font-semibold text-teal-700 block mb-2">
                                            <span className="label-text">Agreement Type *</span>
                                        </label>
                                        <select
                                            name="room_type"
                                            className={`select select-bordered w-full bg-white ${errors.room_type ? 'select-error' : ''} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all`}
                                            value={formData.room_type}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        >
                                            <option value="">Select agreement type</option>
                                            {roomTypeOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.room_type && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.room_type}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Conditional Rental Duration Section */}
                                {showDurationFields && (
                                    <>
                                        <div className="divider text-teal-700 font-semibold">Rental Agreement Details</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                                                <label className="label text-lg font-semibold text-teal-700 block mb-2">
                                                    <span className="label-text">Lease Duration *</span>
                                                </label>
                                                <select
                                                    name="lease_duration"
                                                    className={`select select-bordered w-full bg-white ${errors.lease_duration ? 'select-error' : ''} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all`}
                                                    value={formData.lease_duration}
                                                    onChange={handleInputChange}
                                                    disabled={loading}
                                                >
                                                    <option value="">Select duration</option>
                                                    {durationOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.lease_duration && (
                                                    <label className="label">
                                                        <span className="label-text-alt text-error">{errors.lease_duration}</span>
                                                    </label>
                                                )}
                                            </div>

                                            <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                                                <label className="label text-lg font-semibold text-teal-700 block mb-2">
                                                    <span className="label-text">Lease Start Date *</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="lease_start_date"
                                                    className={`input input-bordered w-full bg-white ${errors.lease_start_date ? 'input-error' : ''} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all`}
                                                    value={formData.lease_start_date}
                                                    onChange={handleInputChange}
                                                    disabled={loading}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                                {errors.lease_start_date && (
                                                    <label className="label">
                                                        <span className="label-text-alt text-error">{errors.lease_start_date}</span>
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                                                <label className="label text-lg font-semibold text-teal-700 block mb-2">
                                                    <span className="label-text">Lease End Date</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="lease_end_date"
                                                    className="input input-bordered w-full bg-white bg-base-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                                                    value={formData.lease_end_date || calculateEndDate()}
                                                    disabled={true}
                                                    placeholder="Auto-calculated"
                                                />
                                                <label className="label">
                                                    <span className="label-text-alt text-base-content/60 text-xs">
                                                        Auto-calculated based on start date + duration
                                                    </span>
                                                </label>
                                            </div>

                                            <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                                                <label className="label text-lg font-semibold text-teal-700 block mb-2">
                                                    <span className="label-text">Monthly Rent</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="monthly_rent"
                                                    placeholder="Auto-set based on duration"
                                                    className="input input-bordered w-full bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
                                                    value={formData.monthly_rent}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                    step="0.01"
                                                    disabled={loading}
                                                    readOnly // Prevent manual override for auto-set
                                                />
                                                <label className="label">
                                                    <span className="label-text-alt text-base-content/60 text-xs">
                                                        Auto-set: 200 LKR (6m), 150 LKR (12m), 100 LKR (24m)
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                                            <label className="label text-lg font-semibold text-teal-700 block mb-2">
                                                <span className="label-text">Security Deposit</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="security_deposit"
                                                placeholder="One-time security deposit"
                                                className={`input input-bordered w-full bg-white ${errors.security_deposit ? 'input-error' : ''} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all`}
                                                value={formData.security_deposit}
                                                onChange={handleInputChange}
                                                min="0"
                                                step="0.01"
                                                disabled={loading}
                                            />
                                            {errors.security_deposit && (
                                                <label className="label">
                                                    <span className="label-text-alt text-error">{errors.security_deposit}</span>
                                                </label>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Financial Information Section */}
                                <div className="divider text-teal-700 font-semibold">Financial Information</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                                        <label className="label text-lg font-semibold text-teal-700 block mb-2">
                                            <span className="label-text">Total Price/Deposit *</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            placeholder="0.00"
                                            className={`input input-bordered w-full bg-white ${errors.price ? 'input-error' : ''} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all`}
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="0.01"
                                            disabled={loading}
                                        />
                                        {errors.price && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.price}</span>
                                            </label>
                                        )}
                                    </div>

                                    <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                                        <label className="label text-lg font-semibold text-teal-700 block mb-2">
                                            <span className="label-text">Agreement Date *</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="purchase_date"
                                            className={`input input-bordered w-full bg-white ${errors.purchase_date ? 'input-error' : ''} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all`}
                                            value={formData.purchase_date}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                        {errors.purchase_date && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.purchase_date}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Additional Notes Section */}
                                <div className="p-4 bg-white border border-teal-300 rounded-lg shadow-md">
                                    <label className="label text-lg font-semibold text-teal-700 block mb-2">
                                        <span className="label-text">Additional Notes *</span>
                                    </label>
                                    <textarea
                                        name="content"
                                        className={`textarea textarea-bordered h-24 w-full bg-white ${errors.content ? 'textarea-error' : ''} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all`}
                                        placeholder={
                                            formData.room_type === 'rent' 
                                                ? 'Enter rental agreement details, special conditions, etc.' 
                                                : 'Enter any additional notes or special instructions'
                                        }
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                    {errors.content && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">{errors.content}</span>
                                        </label>
                                    )}
                                </div>

                                {/* Form Actions */}
                               
                                    <div className="card-actions justify-between gap-4 mt-6 p-4">
    <button 
        type="submit" 
        className="btn btn-primary text-white bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 transition-all px-6 py-3 rounded-full flex items-center"
        disabled={loading}
    >
        {loading ? (
            <>
                <span className="loading loading-spinner"></span>
                Creating Agreement...
            </>
        ) : (
            formData.room_type === 'rent' ? 'Create Rental Agreement' : 'Create Purchase'
        )}
    </button>
    <Link to="/purchases" className="btn btn-ghost text-teal-700 hover:bg-teal-100 transition-all px-4 py-3 rounded-full">
        Cancel
    </Link>
</div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SDcreatepurchase;