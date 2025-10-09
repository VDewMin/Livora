import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../components/vd_confirmDialog";
import toast from "react-hot-toast";

const ResidentList = () => {
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const navigate = useNavigate();

  const [confirmDialog, setConfirmDialog] = useState({
          isOpen: false,
          title: '',
          message: '',
          onConfirm: () => {}
  });

  useEffect(() => {
  axiosInstance
      .get("/users")
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
          await axiosInstance.delete(`/users/${id}`);
          toast.success("Resident deleted successfully!");
          setResidents(prev => prev.filter((r) => r._id !== id));
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete resident");
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleViewDetails = (resident) => {
    setSelectedResident(resident);
    setShowDetailsModal(true);
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
                        onClick={() => handleViewDetails(res)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Details
                      </button>
                      <button
                        onClick={() => navigate(`/admin/update-user/${res._id}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(res._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                      >
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
                  <button
                    onClick={() => handleViewDetails(res)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Details
                  </button>
                  <button
                    onClick={() => navigate(`/admin/update-user/${res._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(res._id)}
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

      {showDetailsModal && selectedResident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Resident Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Resident ID:</span>
                    <p className="text-gray-900 font-medium">{selectedResident.userId}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Full Name:</span>
                    <p className="text-gray-900 font-medium">{selectedResident.firstName} {selectedResident.lastName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Date of Birth:</span>
                    <p className="text-gray-900">{selectedResident.dateOfBirth
                      ? selectedResident.dateOfBirth.split("T")[0]
                      : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Job:</span>
                    <p className="text-gray-900">{selectedResident.job || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{selectedResident.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Recovery Email:</span>
                    <p className="text-gray-900">{selectedResident.recoveryEmail || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone Number:</span>
                    <p className="text-gray-900">{selectedResident.phoneNo}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Secondary Phone:</span>
                    <p className="text-gray-900">{selectedResident.secondaryPhoneNo || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Emergency Contact Name:</span>
                    <p className="text-gray-900">{selectedResident.emergencyContactName || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Emergency Contact Number:</span>
                    <p className="text-gray-900">{selectedResident.emergencyContactNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Number of Family Members:</span>
                    <p className="text-gray-900">{selectedResident.familyMembers || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Medical Conditions:</span>
                    <p className="text-gray-900">{selectedResident.medicalConditions || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resident Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Apartment No:</span>
                    <p className="text-gray-900">{selectedResident.apartmentNo}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Resident Type:</span>
                    <p className="text-gray-900">{selectedResident.residentType}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentList;
