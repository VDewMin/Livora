import { PenSquareIcon, Trash2Icon } from 'lucide-react'
import { Link } from 'react-router'
import api from '../lib/axios.js'
import toast from 'react-hot-toast'




const SDNoteCard = ({note,setNotes}) => {

    const handleDelete = async(e, id) => {
        e.preventDefault(); // Prevent navigating to note details page
        
        if(!window.confirm("Are you sure you want to delete this note?")) 
            return;
         try {
                await api.delete(`/notes/${id}`)
                setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id)); // Update state to remove deleted note
                toast.success("Note deleted successfully");
        }catch (error) {
            console.log("Error deleting note: ",error);
            toast.error("Failed to delete note");
        }

    }
  return <Link to={`/note/${note._id}`}
  className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00FF9D]
  ">
        
         <div className='card-body'>
            <h3 className='card-title text-base-content'>{note.title}</h3>
            <p className='text-sm text-base-content/70 line-clamp-3'> {note.content}</p>
            <div className='card-actions justify-between items-center mt-4'>
                <span className='text-sm text-base-content/50 '>
                {note.createdAt} </span>

                <div className='flex items-center gap-1'>
                    <PenSquareIcon className='size-4 '/>
                    <button className='btn btn-ghost btn-xs  text-error'onClick={(e)=>handleDelete(e, note._id)}>
                        <Trash2Icon className='size-4'/>
                    </button>

                </div>

            </div>

         </div>
 

  </Link>
  
}


export default SDNoteCard