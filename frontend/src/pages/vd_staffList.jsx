import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { useNavigate } from "react-router-dom"; 
import ConfirmDialog from "../components/vd_confirmDialog";
import toast from "react-hot-toast";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const navigate = useNavigate(); 

  const [confirmDialog, setConfirmDialog] = useState({
          isOpen: false,
          title: '',
          message: '',
          onConfirm: () => {}
  });

  useEffect(() => {
  axiosInstance
      .get("/users") // <- remove extra /users
      .then((res) => {
        const staffOnly = res.data.filter(u => u.role === "Staff");
        setStaff(staffOnly);
      })
      .catch((err) => console.error("Error fetching staff:", err));
  }, []);


  const handleDelete = async (id) => {

    
    setConfirmDialog({
            isOpen: true,
            title: 'Delete User',
            message: 'Are you sure you want to delete this user?',
            onConfirm: async () => {
                 try {
                  await axiosInstance.delete(`/users/${id}`);
                  toast.success("User deleted successfully!");
                  // update UI
                  setStaff(staff.filter((u) => u._id !== id));
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to delete user");
                }
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
    });

  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Staff Members</h2>
        <button
          onClick={() => navigate("/register")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add User
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Staff ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Staff Type</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.length > 0 ? (
              staff.map((st) => (
                <tr key={st._id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{st.userId}</td>
                  <td className="border px-4 py-2">
                    {st.firstName} {st.lastName}
                  </td>
                  <td className="border px-4 py-2">{st.email}</td>
                  <td className="border px-4 py-2">{st.phoneNo}</td>
                  <td className="border px-4 py-2">{st.staffType}</td>
                  <td className="border px-4 py-2">
                    <div className="flex gap-2">
                       <button 
                        onClick={() => navigate(`/admin/update-user/${st._id}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          Edit
                      </button>
                      <button 
                       onClick={() => handleDelete(st._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500 border">
                  No staff members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    
      <div className="lg:hidden">
        {staff.length > 0 ? (
          staff.map((st) => (
            <div key={st._id} className="border border-gray-300 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 gap-2">
                <div><span className="font-semibold">Staff ID:</span> {st.userId}</div>
                <div><span className="font-semibold">Name:</span> {st.firstName} {st.lastName}</div>
                <div><span className="font-semibold">Email:</span> {st.email}</div>
                <div><span className="font-semibold">Phone:</span> {st.phoneNo}</div>
                <div><span className="font-semibold">Staff Type:</span> {st.staffType}</div>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => navigate(`/admin/update-user/${st._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(st._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No staff members found
          </div>
        )}
      </div>

      <ConfirmDialog
                  isOpen={confirmDialog.isOpen}
                  title={confirmDialog.title}
                  message={confirmDialog.message}
                  onConfirm={confirmDialog.onConfirm}
                  onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>

    
  );
};

export default StaffList;