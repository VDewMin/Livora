import React from 'react'
import Navbar from '../components/SDNavbar.jsx'
import { useState } from 'react'
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import NoteCard from '../components/SDNoteCard.jsx';
import NotesNotfound from '../components/SDNotesNotfound.jsx';
import api from '../lib/axios.js';
import { Link } from 'react-router';    



const SDHomePage = () => {
    const [isRatelimited, setIsRateLimited] =  useState(false);
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
                console.log('Error fetching notes:');
                console.log(error);
                if(error.response?.status === 429) {
                    setIsRateLimited(true);
                } else {
                    toast.error("Something went wrong");
                }
                //setLoading(false);
            } finally {
                setLoading(false);
            }
        }
        fetchNotes();
    }, []);

  return <div className="min-h-screen">
        <Navbar/>

        

        <div className='max-w-7xl mx-auto p-4 mt-6'>
            {loading && <div className='text-center text-primary py-10'>Loading...</div>}

            {notes.length === 0 && !isRatelimited && <NotesNotfound/> }

            {notes.length > 0 && !isRatelimited && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {notes.map(note => (
                        <NoteCard key ={note._id} note={note} setNotes={setNotes}/>
                    ))}
                </div>)}
        </div>
        
    </div>
  
}

export default SDHomePage;