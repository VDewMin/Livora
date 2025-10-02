import React from 'react';
import Navbar from '../components/SDNavbar.jsx';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import NoteCard from '../components/SDNoteCard.jsx';
import NotesNotfound from '../components/SDNotesNotfound.jsx';
import api from '../lib/axios.js';
import { Link } from 'react-router-dom';

const SDHomePage = () => {
  const [isRatelimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await api.get('/notes');
        console.log(response.data);
        setNotes(response.data);
        setIsRateLimited(false);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching notes:', error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error('Something went wrong');
        }
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100">
      <Navbar />

      {/* Hero Section */}
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
      

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center py-10 bg-teal-50 rounded-lg shadow-md">
            <svg
              className="animate-spin h-10 w-10 text-teal-600 mx-auto mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373A8 8 0 0012 20v-4a4 4 0 01-4-4H6z"
              ></path>
            </svg>
            <p className="text-teal-700 mt-2">Loading your notes, please wait...</p>
          </div>
        )}

        {notes.length === 0 && !isRatelimited && <NotesNotfound />}

        {isRatelimited && (
          <div className="text-center py-10 bg-teal-50 rounded-lg shadow-md border-l-4 border-teal-600">
            <p className="text-teal-700 text-lg mb-2">Rate Limit Exceeded</p>
            <p className="text-gray-600 mb-4">Please try again later (typically within 1 minute) or contact support at support@example.com.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {notes.length > 0 && !isRatelimited && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-teal-800 mb-6 border-b-2 border-teal-200 pb-2">Income Notes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} setNotes={setNotes} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SDHomePage;