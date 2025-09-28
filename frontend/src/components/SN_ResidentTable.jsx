import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResidentTable() {
  const [residents, setResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/payments/residents/current-month-charges"
        );
        console.log("Residents data:", res.data);
        setResidents(res.data || []);
      } catch (error) {
        console.error("Error fetching residents:", error);
        toast.error("Failed to load residents data");
      }
    };

    fetchResidents();
  }, []);

  // ✅ Safe filter using correct fields
  const filteredResidents = residents.filter((r) => {
    const name = (r.residentName ?? "").toLowerCase();
    const unit = (r.apartmentNo ?? "").toLowerCase();
    return (
      name.includes(searchTerm.toLowerCase()) ||
      unit.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or unit..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded px-3 py-1 mb-4 w-full"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Unit</th>
              <th className="border border-gray-300 px-4 py-2">Amount Due</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.length > 0 ? (
              filteredResidents.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {r.residentName || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {r.apartmentNo || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {r.monthlyPayment ?? 0}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {r.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No residents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
