import React from 'react'
import {useState} from "react"
import {useEffect} from "react"
import api from "../lib/axios.js"
import { Plus, Edit, Trash } from "lucide-react"
import {formatDate} from "../lib/utils.js"
import {Link} from "react-router"
import toast from "react-hot-toast"

const KsViewParcels = () => {
  const [parcels, setParcels] = useState([])
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchParcels = async () => {
    try {
      const res = await api.get("/parcels")
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

const handleDelete = async (id) => {
  
  if(!window.confirm("Are you sure you want to delete this parcel?")) return;
  
  try {
    await api.delete(`/parcels/${id}`)
    setParcels((prev) => prev.filter((p) => p._id !== id))
    toast.success("Parcel deleted successfuly!")
  } catch (error) {
    console.log("error in handleDelete", error)
    toast.error("Failed to delete Parcel")
  }
}

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
        <Link to="/addParcel" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700">
          <Plus size={18} /> Add Parcel
        </Link>
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
                      parcel.status === "Collected"
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
                    ? formatDate(new Date(parcel.collectedDateTime))
                    : "-"}
                </td>

                <td className="px-4 py-2">{parcel.collectedByName || "-"}</td>
                <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Link
                    to={`/parcel/${parcel._id}`}
                    className="flex items-center gap-1 text-blue-600 hover:underline px-2 py-1"
                  >
                    <Edit size={16} /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(parcel._id)}
                    className="flex items-center gap-1 text-red-600 hover:underline px-2 py-1"
                  >
                    <Trash size={16} /> Delete
                  </button>
                  </div>
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