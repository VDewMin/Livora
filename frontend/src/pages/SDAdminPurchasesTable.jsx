import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit3Icon, Trash2Icon } from 'lucide-react';
import axiosInstance from '../lib/axios.js';
import toast from 'react-hot-toast';

const SDAdminPurchasesTable = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axiosInstance.get('/purchases');
        const data = response.data;
        setPurchases(data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
        toast.error('Failed to load purchases');
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const calculateLeftTimeDuration = (purchase) => {
    if (purchase.room_type !== 'rent' || !purchase.lease_end_date) return 'N/A';
    const now = new Date();
    const endDate = new Date(purchase.lease_end_date);
    const remainingDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return remainingDays > 0 ? `${remainingDays} days` : 'Expired';
  };

  const getStatus = (purchase) => {
    if (purchase.room_type !== 'rent') return 'Completed';
    const remaining = calculateLeftTimeDuration(purchase);
    return remaining === 'Expired' ? 'Expired' : 'Active';
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete purchase ${id}?`)) return;
    try {
      await axiosInstance.delete(`purchases/${id}`);
      setPurchases(purchases.filter(p => p._id !== id));
      toast.success('Purchase deleted');
    } catch (error) {
      console.error('Error deleting purchase:', error);
      toast.error('Failed to delete purchase');
    }
  };

  // Filter purchases based on room_id search term
  const filteredPurchases = purchases.filter(purchase =>
    purchase.room_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Purchase Overview</h2>
      {/* Search Bar */}
      <div className="mb-6">
        <label htmlFor="searchRoomId" className="block text-sm font-medium text-teal-700 mb-2">
          Search by Room ID
        </label>
        <input
          type="text"
          id="searchRoomId"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter Room ID"
          className="input input-bordered w-full max-w-xs border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="py-2 px-4 border-b">Room ID</th>
              <th className="py-2 px-4 border-b">Buyer Name</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Left Time Duration</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Price (LKR)</th>
              <th className="py-2 px-4 border-b">Purchase Date</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.map((purchase) => (
              <tr key={purchase._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{purchase.room_id}</td>
                <td className="py-2 px-4 border-b">{purchase.buyer_Name}</td>
                <td className="py-2 px-4 border-b">{purchase.room_type}</td>
                <td className="py-2 px-4 border-b">{calculateLeftTimeDuration(purchase)}</td>
                <td className={`py-2 px-4 border-b ${getStatus(purchase) === 'Expired' ? 'text-red-600' : 'text-green-600'}`}>
                  {getStatus(purchase)}
                </td>
                <td className="py-2 px-4 border-b">{purchase.price?.toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{new Date(purchase.purchase_date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">
                  <Link to={`/purchases/${purchase._id}`} className="text-blue-600 mr-2">
                    <Edit3Icon className="h-5 w-5" />
                  </Link>
                  <button onClick={() => handleDelete(purchase._id)} className="text-red-600">
                    <Trash2Icon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredPurchases.length === 0 && <p className="text-center py-4">No purchases found.</p>}
    </div>
  );
};

export default SDAdminPurchasesTable;