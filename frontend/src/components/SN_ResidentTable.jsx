// components/ResidentTable.jsx
import { useState } from "react";

export default function ResidentTable({ residents }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredResidents = residents.filter((r) => {
    const matchesStatus =
      filter === "All" || r.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = r.apartmentNo
      .toString()
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Resident Payment Status
        </h2>

        {/* Search + Filter */}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by Apartment No"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-3 py-1 text-sm focus:ring focus:ring-blue-200"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-xl px-3 py-1 text-sm"
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Apartment No</th>
            <th className="border p-2">Resident Name</th>
            <th className="border p-2">Amount To Pay</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredResidents.length > 0 ? (
            filteredResidents.map((r) => (
              <tr key={r.residentId}>
                <td className="border px-4 py-2">{r.apartmentNo}</td>
                <td className="border px-4 py-2">{r.residentName}</td>
                <td className="border px-4 py-2">
                  Rs. {Number(r.amountToPay || 0).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      r.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="text-center p-4 text-gray-500 italic"
              >
                No matching residents found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
