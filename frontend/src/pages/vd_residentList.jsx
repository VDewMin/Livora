import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/vd_confirmDialog";
import toast from "react-hot-toast";

const ResidentList = () => {
  const [residents, setResidents] = useState([]);

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
        const residentOnly = res.data.filter(u => u.role === "Resident");
        setResidents(residentOnly);
      })
      .catch((err) => console.error("Error fetching staff:", err));
  }, []);

  const handleDelete = async (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Resident',
      message: 'Are you sure you want to delete this resident?',
      onConfirm: async () => {
        try {
          await axiosInstance.delete(`/users/${id}`); // same backend route
          toast.success("Resident deleted successfully!");
          // update UI
          setResidents(prev => prev.filter((r) => r._id !== id));
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete resident");
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };



  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Residents</h2>
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
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Resident Id</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Apartment No</th>
              <th className="border px-4 py-2">Resident Type</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {residents.length > 0 ? (
              residents.map((res) => (
                <tr key={res._id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{res.userId}</td>
                  <td className="border px-4 py-2">
                    {res.firstName} {res.lastName}
                  </td>
                  <td className="border px-4 py-2">{res.email}</td>
                  <td className="border px-4 py-2">{res.phoneNo}</td>
                  <td className="border px-4 py-2">{res.apartmentNo}</td>
                  <td className="border px-4 py-2">{res.residentType}</td>
                  <td className="border px-4 py-2">
                    <div className="flex gap-2">
                      <button 
                      onClick={() => navigate(`/admin/update-user/${res._id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                      </button>
                      <button 
                      onClick={() => handleDelete(res._id)}
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
                <td colSpan="7" className="text-center py-4 text-gray-500 border">
                  No residents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {residents.length > 0 ? (
          residents.map((res) => (
            <div key={res._id} className="border border-gray-300 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 gap-2">
                <div><span className="font-semibold">Resident Id:</span> {res.userId}</div>
                <div><span className="font-semibold">Name:</span> {res.firstName} {res.lastName}</div>
                <div><span className="font-semibold">Email:</span> {res.email}</div>
                <div><span className="font-semibold">Phone:</span> {res.phoneNo}</div>
                <div><span className="font-semibold">Apartment No:</span> {res.apartmentNo}</div>
                <div><span className="font-semibold">Resident Type:</span> {res.residentType}</div>
                <div className="flex gap-2 mt-3">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1">
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
            No residents found
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

export default ResidentList;