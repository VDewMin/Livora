import { Link, LoaderIcon } from 'lucide-react';
import React, { use } from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { ArrowLeftIcon, Trash2Icon } from 'lucide-react';
import api from '../lib/axios.js';



const SDNoteDetailsPage = () => {

  const[note, setNote] = useState(null);
  const[loading, setLoading] = useState(true);
  const[saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const {id} = useParams();

  useEffect(() => {
    const fetchNote = async() => {
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

  const handDelete = async() => {
    if(!window.confirm("Are you sure you want to delete this note?")) 
      return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      navigate("/notes");
    } catch (error) {
      console.log("Error deleting note: ", error);
      toast.error("Failed to delete note");
    }
    
  }
  const handleSave = async() => {
    if(!note.title.trim() || !note.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, {
        title: note.title,
        content: note.content,
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


  if(loading) {
    return <div className='min-h-screen flex items-center justify-center'>
      <LoaderIcon className='text-primary animate-spin'/>
    </div>
  }






  return <div className='min-h-screen bg-base-200'>
    <div className='container mx-auto px-3 py-8'>
      <div className='max-w-2xl mx-auto '>
        <div className='flex items-center justify-between mb-6'>
        <Link to="/" className='btn btn-ghost'>
         <ArrowLeftIcon className='h-5 w-5'/>
            Back to home
               </Link>
        <button onClick={handDelete} className='btn btn-error btn-sm mb-4 ml-4 float-right'>
          <Trash2Icon className='size-4 mr-2'/> Delete Note
        </button> 
        </div>

        <div className='card bg-base-100 '>
          <div className='card-body'>
            <div className='form-control mb-4'>
                <label className='label'>
                  <span className='label-text'>Title</span>
                </label>
                <input type="text" 
                placeholder='Note title'
                className='input input-bordered' 
                value={note?.title}
                onChange={(e) => setNote({...note, title: e.target.value})}
                />
                  </div>

            <div className='form-control mb-4'>
                <label className='label'>
                  <span className='label-text'>Content</span>
                </label>
                <textarea 
                className='textarea textarea-bordered h-24' 
                placeholder='Note content'
                value={note?.content}
                onChange={(e) => setNote({...note, content: e.target.value})}
                ></textarea>  
                  </div>


                  <div className='card-actions justify-end'>
                  <button className='btn btn-primary' disabled={saving} onClick={handleSave}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                </div> 

            </div>


        </div>

    </div>
  </div>
</div>   


  
};

export default SDNoteDetailsPage 