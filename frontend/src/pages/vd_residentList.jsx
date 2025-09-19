import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";

const ResidentList = () => {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/users?role=Resident") // backend should filter by role
      .then((res) => setResidents(res.data))
      .catch((err) => console.error("Error fetching residents:", err));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Residents</h2>

        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
          <thead>
            <tr className="bg-gray-200">
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
                  <td className="border px-4 py-2">
                    {res.firstName} {res.lastName}
                  </td>
                  <td className="border px-4 py-2">{res.email}</td>
                  <td className="border px-4 py-2">{res.phoneNo}</td>
                  <td className="border px-4 py-2">{res.apartmentNo}</td>
                  <td className="border px-4 py-2">{res.residentType}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500 border">
                  No residents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResidentList;
