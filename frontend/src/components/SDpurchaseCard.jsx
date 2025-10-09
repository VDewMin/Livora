import { PenSquareIcon, Trash2Icon, FileTextIcon } from 'lucide-react';
import { Link } from 'react-router-dom'; // Fixed import
import api from '../lib/axios.js';
import toast from 'react-hot-toast';
import { formatDate } from '../lib/utils.js';

const SDpurchaseCard = ({ purchase, setPurchases }) => {
    const handleDelete = async (e, id) => {
        e.preventDefault(); 
        
        if (!window.confirm(`Are you sure you want to delete purchase ${purchase.purchase_id}?`)) 
            return;
        
        try {
            await api.delete(`/purchases/${id}`);
            setPurchases((prevPurchases) => prevPurchases.filter((p) => p._id !== id));
            toast.success(`Purchase ${purchase.purchase_id} deleted successfully`);
        } catch (error) {
            console.error("Error deleting purchase: ", error);
            toast.error("Failed to delete purchase");
        }
    };

    const handleViewDetails = (e) => {
        e.preventDefault();
        toast(`Viewing details for ${purchase.purchase_id}`);
    };

    return (
        <Link to={`/purchases/${purchase._id}`} className="card bg-white hover:shadow-xl transition-all duration-300 border-t-4 border-solid border-teal-500 rounded-lg overflow-hidden">
            <div className='card-body p-4'>
                {/* Purchase Header */}
                <div className='flex justify-between items-start'>
                    <h3 className='card-title text-xl font-semibold text-teal-700'>
                        {purchase.apartmentNo} - {purchase.buyer_Name}
                    </h3>
                    <span className='badge badge-success badge-sm text-white bg-green-500'>{purchase.room_type}</span>
                </div>

                {/* Purchase Summary */}
                <div className='space-y-2 mt-2'>
                    <p className='text-sm text-teal-600'>
                        <strong className='font-medium'>Room:</strong> {purchase.apartmentNo}
                    </p>
                    <p className='text-sm text-teal-800 line-clamp-2'>
                        {purchase.content || `Purchase of ${purchase.room_type} apartment ${purchase.apartmentNo}`}
                    </p>
                </div>

                {/* Price and Date */}
                <div className='stats stats-horizontal stats-sm w-full mt-4 bg-teal-50 p-2 rounded'>
                    <div className='stat'>
                        <div className='stat-title text-xs text-teal-600'>Price</div>
                        <div className='stat-value text-teal-800'>LKR {purchase.price?.toLocaleString()}</div>
                    </div>
                    <div className='stat'>
                        <div className='stat-title text-xs text-teal-600'>Date</div>
                        <div className='stat-value text-sm text-teal-800'>{formatDate(purchase.purchase_date)}</div>
                        <span className='text-xs text-teal-500'>
                            Created: {formatDate(purchase.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className='card-actions justify-between items-center mt-4'>
                    <span className='text-xs text-teal-500'>
                        Created: {formatDate(purchase.createdAt)}
                    </span>

                    <div className='flex items-center gap-2'>
                        <Link 
                            to={`/purchases/${purchase._id}`} 
                            className='btn btn-ghost btn-xs text-teal-700 hover:bg-teal-100 transition-all'
                            title='Edit Purchase'
                        >
                            <PenSquareIcon className='size-4' />
                        </Link>
                        
                        <button 
                            className='btn btn-ghost btn-xs text-red-600 hover:bg-red-100 transition-all'
                            onClick={(e) => handleDelete(e, purchase._id)}
                            title='Delete Purchase'
                        >
                            <Trash2Icon className='size-4' />
                        </button>

                        <button 
                            className='btn btn-ghost btn-xs text-teal-700 hover:bg-teal-100 transition-all'
                            onClick={handleViewDetails}
                            title='View Details'
                        >
                            <FileTextIcon className='size-4' />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default SDpurchaseCard;