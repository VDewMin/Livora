import { PenSquareIcon, Trash2Icon, FileTextIcon } from 'lucide-react'
import { Link } from 'react-router' // Fixed import
import api from '../lib/axios.js'
import toast from 'react-hot-toast'
import { formatDate } from '../lib/utils.js' // Assuming you have a date formatting utility



    

const SDpurchaseCard = ({ purchase, setPurchases }) => {
    const handleDelete = async (e, id) => {
        e.preventDefault(); 
        
        if (!window.confirm(`Are you sure you want to delete purchase ${purchase.purchase_id}?`)) 
            return;
        
        try {
            await api.delete(`/purchases/${id}`)
            setPurchases((prevPurchases) => prevPurchases.filter((p) => p._id !== id))
            toast.success(`Purchase ${purchase.purchase_id} deleted successfully`)
        } catch (error) {
            console.error("Error deleting purchase: ", error)
            toast.error("Failed to delete purchase")
        }
    }

    const handleViewDetails = (e) => {
        // Optional: Handle view details without navigation
        e.preventDefault()
        // Could open modal or navigate programmatically
        toast(`Viewing details for ${purchase.purchase_id}`)
    }

    return (
        <Link to={`/purchases/${purchase._id}`} className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00FF9D]">
            <div className='card-body'>
                {/* Purchase Header */}
                <div className='flex justify-between items-start'>
                    <h3 className='card-title text-base-content'>
                        {purchase.room_id} - {purchase.buyer_Name}
                    </h3>
                    <span className='badge badge-success badge-sm'>{purchase.room_type}</span>
                </div>

                {/* Purchase Summary */}
                <div className='space-y-2'>
                    <p className='text-sm text-base-content/80'>
                        <strong>Room:</strong> {purchase.room_id}
                    </p>
                    <p className='text-sm text-base-content/70 line-clamp-2'>
                        {purchase.content || `Purchase of ${purchase.room_type} apartment ${purchase.room_id}`}
                    </p>
                </div>

                {/* Price and Date */}
                <div className='stats stats-horizontal stats-sm w-full mt-3'>
                    <div className='stat'>
                        <div className='stat-title text-xs'>Price</div>
                        <div className='stat-value text-primary'>${purchase.price?.toLocaleString()}</div>
                    </div>
                    <div className='stat'>
                        <div className='stat-title text-xs'>Date</div>
                        <div className='stat-value text-xs'>{formatDate(purchase.purchase_date)}</div>
                             <span className='text-sm text-base-content/50'>
                                 Created: {formatDate(purchase.createdAt)}
                            </span>
                    </div>
                </div>

                {/* Actions */}
                <div className='card-actions justify-between items-center mt-4'>
                    <span className='text-sm text-base-content/50'>
                        Created: {formatDate(purchase.createdAt)}
                    </span>

                    <div className='flex items-center gap-1'>
                        <Link 
                            to={`/purchases/${purchase._id}`} 
                            className='btn btn-ghost btn-xs'
                            title='Edit Purchase'
                        >
                            <PenSquareIcon className='size-4' />
                        </Link>
                        
                        <button 
                            className='btn btn-ghost btn-xs text-error'
                            onClick={(e) => handleDelete(e, purchase._id)}
                            title='Delete Purchase'
                        >
                            <Trash2Icon className='size-4' />
                        </button>

                        <button 
                            className='btn btn-ghost btn-xs'
                            onClick={handleViewDetails}
                            title='View Details'
                        >
                            <FileTextIcon className='size-4' />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}



export default SDpurchaseCard