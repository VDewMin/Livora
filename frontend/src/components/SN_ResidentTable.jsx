import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResidentTable({ residents: propResidents }) {
  const [residents, setResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ Dropdown state

  useEffect(() => {
    if (propResidents) {
      setResidents(propResidents);
      return;
    }

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
  }, [propResidents]);

  // ✅ Filter by search + dropdown status
  const filteredResidents = residents.filter((r) => {
    const name = (r.residentName ?? "").toLowerCase();
    const unit = (r.apartmentNo ?? "").toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      unit.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      r.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4">
      {/* Search + Dropdown Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by name or unit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 md:w-1/3"
        />

        {/* Dropdown Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 w-40"
        >
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

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
