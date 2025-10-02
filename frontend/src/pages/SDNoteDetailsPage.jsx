import { Link, LoaderIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ArrowLeftIcon, Trash2Icon } from 'lucide-react';
import api from '../lib/axios.js';

const SDNoteDetailsPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try { 
        const response = await api.get(`/notes/${id}`);
        setNote(response.data);
      } catch (error) {
        console.log("Error fetching note details: ", error);
        toast.error("Failed to fetch note details");
      } finally {
        setLoading(false);
      }
    }; 
    fetchNote();
  }, [id]);

  const handDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) 
      return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      navigate("/notes");
    } catch (error) {
      console.log("Error deleting note: ", error);
      toast.error("Failed to delete note");
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim() || !note.email.trim()) {
      toast.error("Title, content, and email are required");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, {
        title: note.title,
        content: note.content,
        phone_no: note.phone_no,
        email: note.email
      });
      toast.success("Note updated successfully");
      navigate("/notes");
    } catch (error) {
      console.log("Error updating note: ", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    } 
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-100 to-indigo-200'>
        <LoaderIcon className='h-12 w-12 text-teal-600 animate-spin' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200'>
      <div className='container mx-auto px-4 py-10'>
        <div className='max-w-2xl mx-auto'>
          <div className='flex items-center justify-between mb-8 bg-white p-6 rounded-lg shadow-lg border-l-4 border-teal-500 transform transition-all hover:scale-102'>
            <Link to="/notes" className='btn btn-ghost text-teal-700 hover:bg-teal-100 transition-all'>
              <ArrowLeftIcon className='h-6 w-6 mr-2' />
              Back to Notes
            </Link>
            <button onClick={handDelete} className='btn btn-error btn-sm text-white bg-red-600 hover:bg-red-700 transition-all'>
              <Trash2Icon className='h-5 w-5 mr-2' /> Delete Note
            </button>
          </div>

          <div className='card bg-white shadow-xl rounded-lg overflow-hidden border border-teal-200'>
            <div className='card-body p-6'>
              <div className='form-control mb-6'>
                <label className='label text-teal-700'>
                  <span className='label-text font-semibold'>Title</span>
                </label>
                <input
                  type="text" 
                  className='input input-bordered w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all'
                  value={note?.title || ''}
                  onChange={(e) => setNote({...note, title: e.target.value})}
                />
              </div>

              <div className='form-control mb-6'>
                <label className='label text-teal-700'>
                  <span className='label-text font-semibold'>Content</span>
                </label>
                <textarea 
                  className='textarea textarea-bordered h-32 w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all'
                  placeholder='Note content'
                  value={note?.content || ''}
                  onChange={(e) => setNote({...note, content: e.target.value})}
                ></textarea>  
              </div>

              <div className='form-control mb-6'>
                <label className='label text-teal-700'>
                  <span className='label-text font-semibold'>Phone Number</span>
                </label>
                <textarea 
                  className='textarea textarea-bordered h-24 w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all'
                  value={note?.phone_no || ''}
                  onChange={(e) => setNote({...note, phone_no: e.target.value})}
                ></textarea>  
              </div>

              <div className='form-control mb-8'>
                <label className='label text-teal-700'>
                  <span className='label-text font-semibold'>Email</span>
                </label>
                <textarea 
                  className='textarea textarea-bordered h-24 w-full border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all'
                  value={note?.email || ''}
                  onChange={(e) => setNote({...note, email: e.target.value})}
                ></textarea>  
              </div>

              <div className='card-actions justify-end'>
                <button className='btn btn-primary bg-teal-600 text-white hover:bg-teal-700 transition-all' disabled={saving} onClick={handleSave}>
                  {saving ? <span className='flex items-center'><LoaderIcon className='h-5 w-5 animate-spin mr-2' /> Saving...</span> : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDNoteDetailsPage;