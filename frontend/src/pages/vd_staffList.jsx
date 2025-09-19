import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";

const StaffList = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/users?role=Staff") // backend should filter by role
      .then((res) => setStaff(res.data))
      .catch((err) => console.error("Error fetching staff:", err));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Staff Members</h2>

        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
          <thead>
            <tr className="bg-gray-200">
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
                  <td className="border px-4 py-2">
                    {st.firstName} {st.lastName}
                  </td>
                  <td className="border px-4 py-2">{st.email}</td>
                  <td className="border px-4 py-2">{st.phoneNo}</td>
                  <td className="border px-4 py-2">{st.staffType}</td>
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
                <td colSpan="5" className="text-center py-4 text-gray-500 border">
                  No staff members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;
