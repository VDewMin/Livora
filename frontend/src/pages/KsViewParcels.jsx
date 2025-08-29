import React from 'react'
import {useState} from "react"
import {useEffect} from "react"
import axios from "axios"
import { Plus, Edit, Trash } from "lucide-react"
import {formatDate} from "../lib/utils.js"

const KsViewParcels = () => {
  const [parcels, setParcels] = useState([])
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchParcels = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/parcels")
      console.log(res.data)
      setParcels(res.data)
    } catch (error) {
      console.log("error fetching parcels")
    } finally{
      setLoading(false)
    }
  }

  fetchParcels()
},[])

if(loading){
  return <p className="p-6">Loading parcels...</p>
}

return (
  <div className="p-6">
    {/*header */}
    <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Parcel Logs</h2>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700">
          <Plus size={18} /> Add Parcel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Parcel ID</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Resident</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Apartment No</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Courier</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Arrival</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Collected Date</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Collected By</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{parcel.parcelId}</td>
                <td className="px-4 py-2">{parcel.residentName}</td>
                <td className="px-4 py-2">{parcel.apartmentNo}</td>
                <td className="px-4 py-2">{parcel.parcelType}</td>
                <td className="px-4 py-2">{parcel.courierService}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parcel.status === "Picked Up"
                        ? "bg-green-100 text-green-700"
                        : parcel.status === "Removed"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {parcel.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {formatDate(new Date(parcel.arrivalDateTime)) 
                  }
                </td>
                <td className="px-4 py-2">
                  {parcel.collectedDateTime
                    ? new Date(parcel.collectedDateTime).toLocaleString()
                    : "-"}
                </td>
                <td className="px-4 py-2">{parcel.collectedByName || "-"}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button className="flex items-center gap-1 text-blue-600 hover:underline">
                    <Edit size={16} /> Edit
                  </button>
                  <button className="flex items-center gap-1 text-red-600 hover:underline">
                    <Trash size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  </div>
)
}

export default KsViewParcels