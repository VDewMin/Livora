import React, { useState, useEffect, useRef } from 'react';
import { Link, LoaderIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';
import { 
    ArrowLeftIcon, Trash2Icon, SaveIcon, LockIcon, Edit3Icon, 
    CalendarIcon, ClockIcon, AlertTriangleIcon, CheckCircleIcon,
    SendIcon, FileTextIcon, UserIcon
} from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils.js';
import axiosInstance from '../lib/axios.js';
import html2pdf from 'html2pdf.js'; // Import html2pdf

const SDpurchaseDetails = () => {
    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [leaseStatus, setLeaseStatus] = useState(null);
    const detailsRef = useRef(null); // Ref to target the details for PDF

    const navigate = useNavigate();
    const { id } = useParams();

    // Calculate lease metrics
    const calculateLeaseMetrics = (purchase) => {
        if (!purchase || purchase.room_type !== 'rent' || !purchase.lease_start_date || !purchase.lease_end_date) {
            return null;
        }

        const now = new Date();
        const startDate = new Date(purchase.lease_start_date);
        const endDate = new Date(purchase.lease_end_date);
        const totalDuration = (endDate - startDate) / (1000 * 60 * 60 * 24); // Total days
        const elapsedDuration = (now - startDate) / (1000 * 60 * 60 * 24); // Days passed
        const remainingDuration = (endDate - now) / (1000 * 60 * 60 * 24); // Days remaining

        const progress = Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));

        // Determine status
        let status = 'current';
        let statusMessage = '';
        let statusIcon = CheckCircleIcon;
        let statusColor = 'success';

        if (remainingDuration < 0) {
            status = 'expired';
            statusMessage = 'Lease has expired';
            statusIcon = AlertTriangleIcon;
            statusColor = 'error';
        } else if (remainingDuration <= 30) {
            status = 'expiring_soon';
            statusMessage = `Lease expires in ${Math.ceil(remainingDuration)} days`;
            statusIcon = AlertTriangleIcon;
            statusColor = 'warning';
        } else if (remainingDuration <= 90) {
            status = 'renewal_due';
            statusMessage = `Renewal notice due in ${Math.ceil(remainingDuration)} days`;
            statusIcon = ClockIcon;
            statusColor = 'warning';
        } else {
            status = 'current';
            statusMessage = `${Math.ceil(remainingDuration)} days remaining`;
            statusIcon = CheckCircleIcon;
            statusColor = 'success';
        }

        return {
            status,
            statusMessage,
            statusIcon,
            statusColor,
            progress,
            totalDuration,
            elapsedDuration,
            remainingDuration,
            remainingMonths: Math.ceil(remainingDuration / 30)
        };
    };

    useEffect(() => {
        const fetchPurchase = async () => {
            try {
                const response = await axiosInstance.get(`/purchases/${id}`);
                const fetchedPurchase = response.data;
                setPurchase(fetchedPurchase);
                setIsEditable(['rent', 'lease'].includes(fetchedPurchase.room_type));
                if (fetchedPurchase.room_type === 'rent') {
                    setLeaseStatus(calculateLeaseMetrics(fetchedPurchase));
                }
            } catch (error) {
                console.error("Error fetching purchase details: ", error);
                toast.error("Failed to fetch purchase details");
            } finally {
                setLoading(false);
            }
        };
        fetchPurchase();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete purchase ${purchase?.purchase_id}?\n\nThis will ${purchase.room_type === 'rent' ? 'terminate the lease agreement' : 'cancel the ownership transfer'}.`)) 
            return;
        
        try {
            await axiosInstance.delete(`/purchases/${id}`);
            const deleteMessage = purchase.room_type === 'rent' 
                ? `Rental agreement ${purchase.purchase_id} terminated`
                : `Purchase ${purchase.purchase_id} cancelled`;
            toast.success(deleteMessage);
            navigate("/purchases");
        } catch (error) {
            console.error("Error deleting purchase: ", error);
            toast.error("Failed to delete purchase");
        }
    };

    const handleSave = async () => {
        if (!isEditable) {
            toast.error("Only rental agreements can be modified");
            return;
        }

        if (!purchase.buyer_Name?.trim() || !purchase.buyer_Email?.trim() || !purchase.room_id?.trim()) {
            toast.error("Required fields cannot be empty");
            return;
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(purchase.buyer_Email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        const priceNum = Number(purchase.price);
        if (isNaN(priceNum) || priceNum <= 0) {
            toast.error("Price must be a positive number");
            return;
        }

        setSaving(true);
        try {
            await axiosInstance.put(`/purchases/${id}`, {
                buyer_Name: purchase.buyer_Name,
                buyer_id: purchase.buyer_id,
                buyer_Email: purchase.buyer_Email,
                buyer_Phone: purchase.buyer_Phone,
                room_id: purchase.room_id,
                room_type: purchase.room_type,
                price: priceNum,
                purchase_date: purchase.purchase_date,
                content: purchase.content,
                ...(purchase.room_type === 'rent' && {
                    lease_duration: purchase.lease_duration,
                    lease_start_date: purchase.lease_start_date,
                    lease_end_date: purchase.lease_end_date,
                    security_deposit: Number(purchase.security_deposit),
                    monthly_rent: Number(purchase.monthly_rent)
                })
            });
            const saveMessage = purchase.room_type === 'rent' 
                ? 'Rental agreement updated successfully'
                : 'Purchase details updated successfully';
            toast.success(saveMessage);
            navigate("/purchases");
        } catch (error) {
            console.error("Error updating purchase: ", error);
            if (error.response?.status === 403) {
                toast.error(error.response.data.message || "Only rental agreements can be modified");
            } else {
                toast.error("Failed to update purchase");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field, value) => {
        if (!isEditable) return;
        setPurchase(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerateReceipt = () => {
        if (!purchase || !detailsRef.current) {
            console.error('❌ No purchase data or details ref available');
            toast.error('No purchase data available');
            return;
        }

        html2pdf()
            .from(detailsRef.current)
            .set({
                filename: `receipt_${purchase.purchase_id}.pdf`,
                margin: [10, 10, 10, 10],
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            })
            .save()
            .then(() => {
                console.log('✅ Receipt downloaded:', `receipt_${purchase.purchase_id}.pdf`);
                toast.success('Receipt generated and downloaded!');
            })
            .catch((error) => {
                console.error('❌ Receipt generation failed:', error);
                toast.error('Failed to generate receipt');
            });
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-base-200'>
                <div className='text-center'>
                    <LoaderIcon className='h-8 w-8 text-primary animate-spin mx-auto mb-4'/>
                    <p className='text-base-content/70'>Loading purchase details...</p>
                </div>
            </div>
        );
    }

    if (!purchase) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-base-200'>
                <div className='alert alert-error max-w-md'>
                    <span>Purchase not found</span>
                    <Link to="/purchases" className='btn btn-ghost'>Back to Purchases</Link>
                </div>
            </div>
        );
    }

    const isRental = purchase.room_type === 'rent';
    const currentRoomTypeConfig = {
        rent: { label: 'Rental Agreement', editable: true, icon: CalendarIcon },
        sale: { label: 'Purchase Agreement', editable: false, icon: CheckCircleIcon },
        lease: { label: 'Lease Agreement', editable: true, icon: ClockIcon },
        mortgage: { label: 'Mortgage Agreement', editable: false, icon: LockIcon }
    }[purchase.room_type] || { label: 'Agreement', editable: false, icon: FileTextIcon };

    return (
        <div className='min-h-screen bg-base-200'>
            <div className='container mx-auto px-3 py-8'>
                <div className='max-w-5xl mx-auto'>
                    {/* Header Section */} 
                    <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6'>
                        <div className='flex-1'>
                            <Link to="/purchases" className='btn btn-ghost mb-2 lg:mb-0'>
                                <ArrowLeftIcon className='h-5 w-5 mr-2'/>
                                Back to Purchases
                            </Link>
                        </div>
                        
                        <div className='flex items-center gap-4'>
                            {/* Status Badge */} 
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium ${
                                isEditable ? 'bg-success/10 text-success border border-success/20' : 
                                leaseStatus?.status === 'current' ? 'bg-info/10 text-info border border-info/20' :
                                leaseStatus?.status === 'expiring_soon' || leaseStatus?.status === 'renewal_due' ? 'bg-warning/10 text-warning border border-warning/20' :
                                'bg-error/10 text-error border border-error/20'
                            }`}>
                                {isEditable ? <Edit3Icon className='h-4 w-4' /> : <currentRoomTypeConfig.icon className='h-4 w-4' />}
                                <span>{currentRoomTypeConfig.label}</span>
                                {isRental && leaseStatus && (
                                    <>
                                        <span>•</span>
                                        <span className={`font-bold ${leaseStatus.statusColor}`}>
                                            {leaseStatus.status === 'current' ? 'Active' : 
                                             leaseStatus.status === 'expiring_soon' ? 'Expiring' :
                                             leaseStatus.status === 'renewal_due' ? 'Renewal Due' : 'Expired'}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Action Buttons */} 
                            <div className='flex gap-2'>
                                {isRental && leaseStatus && leaseStatus.status !== 'expired' && (
                                    <button className='btn btn-outline btn-sm' onClick={() => {
                                        toast.success('Renewal notice sent to tenant');
                                    }}>
                                        <SendIcon className='h-4 w-4 mr-2'/>
                                        Renewal Notice
                                    </button>
                                )}
                                
                                {isEditable ? (
                                    <button 
                                        onClick={handleSave} 
                                        disabled={saving}
                                        className='btn btn-primary btn-sm'
                                    >
                                        {saving ? (
                                            <>
                                                <LoaderIcon className='h-4 w-4 animate-spin mr-2'/>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <SaveIcon className='h-4 w-4 mr-2'/>
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <div className='tooltip' data-tip="Only rental agreements can be edited">
                                        <button className='btn btn-primary btn-sm btn-disabled'>
                                            <LockIcon className='h-4 w-4 mr-2'/>
                                            Edit Locked
                                        </button>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={handleDelete} 
                                    className='btn btn-error btn-sm'
                                    disabled={saving}
                                >
                                    <Trash2Icon className='h-4 w-4 mr-2'/>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Purchase Header Card */} 
                    <div className='card bg-base-100 shadow-md mb-8'>
                        <div className='card-body'>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                {/* Purchase ID & Basic Info */} 
                                <div className='text-center md:text-left'>
                                    <h1 className='card-title text-2xl font-bold text-primary mb-1'>
                                        #{purchase.purchase_id}
                                    </h1>
                                    <p className='text-base-content/70 mb-2'>{formatDate(purchase.createdAt)}</p>
                                    {purchase.room_type === 'rent' && (
                                        <div className='badge badge-outline'>{purchase.lease_duration?.replace('_', ' ')}</div>
                                    )}
                                </div>

                                {/* Key Financials */} 
                                <div className='text-center md:text-right'>
                                    <div className='text-2xl font-bold text-success mb-1'>
                                        {formatCurrency(purchase.price)}
                                    </div>
                                    {purchase.room_type === 'rent' && purchase.monthly_rent > 0 && (
                                        <p className='text-sm text-base-content/70'>
                                            Monthly: {formatCurrency(purchase.monthly_rent)}
                                        </p>
                                    )}
                                    {purchase.room_type === 'rent' && purchase.security_deposit > 0 && (
                                        <p className='text-sm text-base-content/70'>
                                            Deposit: {formatCurrency(purchase.security_deposit)}
                                        </p>
                                    )}
                                </div>

                                {/* Rental Timeline (Only for Rentals) */}
                                {isRental && leaseStatus && (
                                    <div className='text-center'>
                                        <div className='flex items-center justify-center gap-2 mb-2'>
                                            <CalendarIcon className='h-4 w-4 text-base-content/70'/>
                                            <span className='text-sm text-base-content/70'>Lease Timeline</span>
                                        </div>
                                        
                                        {/* Progress Bar */}
                                        <div className='w-full bg-base-200 rounded-full h-2 mb-2'>
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                    leaseStatus.status === 'current' ? 'bg-success' :
                                                    leaseStatus.status === 'expiring_soon' || leaseStatus.status === 'renewal_due' ? 'bg-warning' :
                                                    'bg-error'
                                                }`} 
                                                style={{ width: `${leaseStatus.progress}%` }}
                                            ></div>
                                        </div>
                                        
                                        <div className='text-xs text-base-content/70'>
                                            {leaseStatus.statusMessage}
                                        </div>
                                        
                                        {leaseStatus.status === 'expired' && (
                                            <div className='badge badge-error badge-sm mt-1'>
                                                Action Required
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        {/* Left Column - Core Details */}
                        <div className='lg:col-span-2 space-y-6'>
                            <div className='card bg-base-100 shadow-lg' ref={detailsRef}>
                                <div className='card-body'>
                                    {/* Buyer Information */}
                                    <div className='mb-6'>
                                        <h3 className='card-title mb-4 flex items-center gap-2'>
                                            <UserIcon className='h-5 w-5 text-base-content/70'/>
                                            Buyer Information
                                        </h3>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <div className='space-y-2'>
                                                <label className='label'>
                                                    <span className='label-text'>Full Name</span>
                                                </label>
                                                {isEditable ? (
                                                    <input
                                                        type='text'
                                                        className='input input-bordered w-full'
                                                        value={purchase.buyer_Name || ''}
                                                        onChange={(e) => handleInputChange('buyer_Name', e.target.value)}
                                                        disabled={saving}
                                                    />
                                                ) : (
                                                    <div className='p-3 bg-base-200 rounded-lg'>
                                                        <span className='font-medium'>{purchase.buyer_Name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className='space-y-2'>
                                                <label className='label'>
                                                    <span className='label-text'>Buyer ID</span>
                                                </label>
                                                {isEditable ? (
                                                    <input
                                                        type='text'
                                                        className='input input-bordered w-full'
                                                        value={purchase.buyer_id || ''}
                                                        onChange={(e) => handleInputChange('buyer_id', e.target.value)}
                                                        disabled={saving}
                                                    />
                                                ) : (
                                                    <div className='p-3 bg-base-200 rounded-lg'>
                                                        <span className='font-medium'>{purchase.buyer_id || 'N/A'}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className='space-y-2'>
                                                <label className='label'>
                                                    <span className='label-text'>Email Address</span>
                                                </label>
                                                {isEditable ? (
                                                    <input
                                                        type='email'
                                                        className='input input-bordered w-full'
                                                        value={purchase.buyer_Email || ''}
                                                        onChange={(e) => handleInputChange('buyer_Email', e.target.value)}
                                                        disabled={saving}
                                                    />
                                                ) : (
                                                    <div className='p-3 bg-base-200 rounded-lg'>
                                                        <span className='font-medium'>{purchase.buyer_Email}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className='space-y-2'>
                                                <label className='label'>
                                                    <span className='label-text'>Phone Number</span>
                                                </label>
                                                {isEditable ? (
                                                    <input
                                                        type='tel'
                                                        className='input input-bordered w-full'
                                                        value={purchase.buyer_Phone || ''}
                                                        onChange={(e) => handleInputChange('buyer_Phone', e.target.value)}
                                                        disabled={saving}
                                                    />
                                                ) : (
                                                    <div className='p-3 bg-base-200 rounded-lg'>
                                                        <span className='font-medium'>{purchase.buyer_Phone || 'N/A'}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Apartment Details */}
                                    <div className='mb-6'>
                                        <h3 className='card-title mb-4 flex items-center gap-2'>
                                            <FileTextIcon className='h-5 w-5 text-base-content/70'/>
                                            Apartment Details
                                        </h3>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <div className='space-y-2'>
                                                <label className='label'>
                                                    <span className='label-text'>Room ID</span>
                                                </label>
                                                <div className='p-3 bg-base-200 rounded-lg'>
                                                    <span className='font-bold text-primary'>{purchase.room_id}</span>
                                                </div>
                                            </div>

                                            <div className='space-y-2'>
                                                <label className='label'>
                                                    <span className='label-text'>Agreement Type</span>
                                                </label>
                                                <div className='p-3 bg-base-200 rounded-lg'>
                                                    <span className={`badge badge-lg ${isEditable ? 'badge-success' : 'badge-info'}`}>
                                                        {currentRoomTypeConfig.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <h3 className='card-title mb-4 flex items-center gap-2'>
                                            <FileTextIcon className='h-5 w-5 text-base-content/70'/>
                                            Additional Notes
                                        </h3>
                                        {isEditable ? (
                                            <textarea
                                                className='textarea textarea-bordered w-full h-24'
                                                value={purchase.content || ''}
                                                onChange={(e) => handleInputChange('content', e.target.value)}
                                                disabled={saving}
                                                placeholder='Enter any additional notes or special instructions'
                                            />
                                        ) : (
                                            <div className='p-4 bg-base-200 rounded-lg min-h-[100px]'>
                                                <p className='whitespace-pre-wrap text-base-content/80'>
                                                    {purchase.content || 'No additional notes provided'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Financial & Timeline Summary */}
                        <div className='space-y-6'>
                            {/* Financial Summary Card */}
                            <div className='card bg-base-100 shadow-lg'>
                                <div className='card-body'>
                                    <h3 className='card-title flex items-center gap-2 mb-4'>
                                        <span className='text-xl'>💰</span>
                                        Financial Summary
                                    </h3>
                                    
                                    <div className='space-y-3'>
                                        <div className='flex justify-between items-center py-2 border-b border-base-200 last:border-b-0'>
                                            <span className='text-sm text-base-content/70'>Total Amount</span>
                                            <span className='font-bold text-lg text-success'>
                                                {formatCurrency(purchase.price)}
                                            </span>
                                        </div>
                                        
                                        {purchase.room_type === 'rent' && (
                                            <>
                                                <div className='flex justify-between items-center py-2 border-b border-base-200'>
                                                    <span className='text-sm text-base-content/70'>Monthly Rent</span>
                                                    <span className='font-semibold'>
                                                        {purchase.monthly_rent ? formatCurrency(purchase.monthly_rent) : 'N/A'}
                                                    </span>
                                                </div>
                                                
                                                <div className='flex justify-between items-center py-2 border-b border-base-200'>
                                                    <span className='text-sm text-base-content/70'>Security Deposit</span>
                                                    <span className='font-semibold'>
                                                        {purchase.security_deposit ? formatCurrency(purchase.security_deposit) : 'N/A'}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        
                                        <div className='flex justify-between items-center py-2 border-b border-base-200'>
                                            <span className='text-sm text-base-content/70'>Agreement Date</span>
                                            <span className='font-medium'>{formatDate(purchase.purchase_date)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rental Timeline Card (Only for Rentals) */}
                            {isRental && leaseStatus && (
                                <div className='card bg-base-100 shadow-lg'>
                                    <div className='card-body'>
                                        <h3 className='card-title flex items-center gap-2 mb-4'>
                                            <CalendarIcon className='h-5 w-5'/>
                                            Lease Timeline
                                        </h3>
                                        
                                        {/* Progress Bar */}
                                        <div className='mb-4'>
                                            <div className='flex justify-between text-xs text-base-content/70 mb-2'>
                                                <span>{formatDate(purchase.lease_start_date)}</span>
                                                <span>{leaseStatus.remainingMonths} months left</span>
                                                <span>{formatDate(purchase.lease_end_date)}</span>
                                            </div>
                                            <div className='w-full bg-base-200 rounded-full h-3'>
                                                <div 
                                                    className={`h-3 rounded-full transition-all duration-300 ${
                                                        leaseStatus.status === 'current' ? 'bg-success' :
                                                        leaseStatus.status === 'expiring_soon' || leaseStatus.status === 'renewal_due' ? 'bg-warning' :
                                                        'bg-error'
                                                    }`} 
                                                    style={{ width: `${leaseStatus.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        {/* Status Alert */}
                                        <div className={`alert alert-${leaseStatus.statusColor} shadow-lg mb-4`}>
                                            <leaseStatus.statusIcon className='h-4 w-4 flex-shrink-0'/>
                                            <span className='font-medium'>{leaseStatus.statusMessage}</span>
                                        </div>
                                        
                                        {/* Action Items */}
                                        <div className='space-y-2'>
                                            {leaseStatus.status === 'renewal_due' && (
                                                <button className='btn btn-warning btn-sm w-full' onClick={() => {
                                                    toast.success('Renewal notice scheduled');
                                                }}>
                                                    <SendIcon className='h-4 w-4 mr-2'/>
                                                    Send Renewal Notice
                                                </button>
                                            )}
                                            
                                            {leaseStatus.status === 'expiring_soon' && (
                                                <button className='btn btn-error btn-sm w-full' onClick={() => {
                                                    toast.success('Vacancy alert created');
                                                }}>
                                                    <AlertTriangleIcon className='h-4 w-4 mr-2'/>
                                                    Plan for Vacancy
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions Card */}
                            <div className='card bg-base-100 shadow-lg'>
                                <div className='card-body p-4'>
                                    <h4 className='font-semibold mb-3 flex items-center gap-2'>
                                        📋 Quick Actions
                                    </h4>
                                    <div className='space-y-2 text-sm'>
                                        {/* Generate Receipt Button */}
                                        <button 
                                            type="button"
                                            className='btn btn-outline btn-sm w-full justify-start' 
                                            onClick={handleGenerateReceipt}
                                           // disabled={loading || !purchase || !purchase.purchase_id}
                                        >
                                            <FileTextIcon className='h-4 w-4 mr-2'/>
                                            Generate Receipt
                                        </button>
                                        
                                        {/* Other buttons */}
                                        {purchase?.room_type === 'rent' && (
                                            <button 
                                                type="button"
                                                className='btn btn-ghost btn-sm w-full justify-start' 
                                                onClick={() => toast.success('Invoice sent to tenant')}
                                            >
                                                <SendIcon className='h-4 w-4 mr-2'/>
                                                Send Monthly Invoice
                                            </button>
                                        )}
                                        
                                        <button 
                                            type="button"
                                            className='btn btn-ghost btn-sm w-full justify-start' 
                                            onClick={() => toast.success('Maintenance request created')}
                                        >
                                            <AlertTriangleIcon className='h-4 w-4 mr-2'/>
                                            Report Maintenance
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className='card-actions justify-between mt-8 pt-4 border-t border-base-200'>
                        <Link to='/purchases' className='btn btn-ghost btn-lg'>
                            ← Back to All Purchases
                        </Link>
                        <div className='flex gap-3'>
                            <button 
                                onClick={handleDelete} 
                                className='btn btn-error btn-lg'
                                disabled={saving}
                            >
                                <Trash2Icon className='h-5 w-5 mr-2'/>
                                Delete Agreement
                            </button>
                            {isEditable && (
                                <button 
                                    onClick={handleSave} 
                                    disabled={saving}
                                    className='btn btn-primary btn-lg'
                                >
                                    {saving ? (
                                        <>
                                            <LoaderIcon className='h-5 w-5 animate-spin mr-2'/>
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            <SaveIcon className='h-5 w-5 mr-2'/>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SDpurchaseDetails;