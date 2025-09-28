import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import axios from 'axios';
import axiosInstance from '../lib/axios.js';




const SDCreatePage = () => {
  const [title,setTitle] = useState('');
  const [content,setContent] = useState('');  
  const [loading,setloading] = useState(false);

  const navigate = useNavigate();

   const handleSubmit = async(e) => {
    e.preventDefault();

    if(!title.trim() || !content.trim()) {
        toast.error("Please provide both title and content");
        return;
    }

    setloading(true);
    try {
         await axiosInstance.post('/notes', {
            title,
            content
        })

        toast.success("Note created successfully");
        navigate("/notes");

      

    } catch (error) {
      console.log("Error creating note: ".error);
       toast.error("Something wrong");
    } finally {
        setloading(false);
    }

   };





  return <div className='min-h-screen bg-base-200'>
      <div className='container mx-auto px-3 py-8'>
        <div className='max-w-2xl mx-auto '>
          <Link to ={"/notes"} className='btn btn-ghost mb-6'>
          <ArrowLeftIcon className='size-5'/>
          Back to home
          </Link>

          <div className='card bg-base-100 shadow-md'>
            <div className='card-body'>
              <h2 className='card-title text-2xl mb-4'>Create a new note </h2>
              <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text'>Title</span>
                  </label>
                  <input type='text' placeholder='Note title' className='input input-bordered w-full'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  />

                </div>

                <div className='form-control mb-4'>
                  <label className='label'> 
                    <span className='label-text'>Content</span>
                  </label>
                  <textarea
                    className='textarea textarea-bordered h-24' 
                    placeholder='Note content'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    ></textarea>  
                </div>

                <div className='card-actions justify-end'>
                <button type='submit' className='btn btn-primary' disabled={loading}>
                  {loading ? 'Creating...' : 'Create Note'} 
                </button>
                </div>
              </form>

             

            </div>

          </div>

        </div>

      </div>

    </div>
  
}

export default SDCreatePage