import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import SDpurchaseCard from '../components/SDpurchaseCard.jsx';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../lib/utils.js';
import { ArrowLeftIcon } from 'lucide-react';


const SDpurchasesList = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {
        try {
            const response = await api.get('/purchases');
            setPurchases(response.data);
        } catch (error) {
            toast.error('Failed to load purchases');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold">Purchase Records</h1>
                {/* Small Navbar */}
                        <nav className="bg-teal-700 text-white p-2 mb-6 rounded-lg shadow-md">
                          <ul className="flex justify-around">
                            <li>
                              <Link
                                to="/purchases"
                                className="px-4 py-2 rounded hover:bg-teal-600 transition-all"
                              >
                                Purchase Apartment Details
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/notes" // Assuming this is the current page or laundry section
                                className="px-4 py-2 rounded hover:bg-teal-600 transition-all"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} // Active state highlight
                              >
                                Buyer Appoinments 
                              </Link>
                            </li>
                          </ul>
                        </nav>

               
                <Link to="/purchases/create" className="btn btn-primary">
                    Create New Purchase
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchases.map(purchase => (
                     <SDpurchaseCard 
                        key={purchase._id} 
                        purchase={purchase} 
                        setPurchases={setPurchases} 
                              />
                        ))}
            </div>
        </div>
    );
};

export default SDpurchasesList;