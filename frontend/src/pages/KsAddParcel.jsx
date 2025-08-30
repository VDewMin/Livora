import React from 'react'
import {useState} from "react"
import toast from "react-hot-toast"
import {Link, useNavigate} from "react-router"
import api from "../lib/axios.js"


const KsAddParcel = () => {
  const [residentName, setResidentName] = useState("")
  const [residentId, setResidentId] = useState("")
  const [apartmentNo, setApartmentNo] = useState("")
  const [parcelType, setParcelType] = useState("")
  const [parcelDescription, setParcelDescription] = useState("")
  const [courierService, setCourierService] = useState("")
  const [status, setStatus] = useState("")
  const [arrivalDateTime, setArrivalDateTime] = useState("")
  const [receivedByStaff, setReceivedByStaff] = useState("")
  const [collectedDateTime, setCollectedDateTime] = useState("")
  const [collectedByName, setCollectedByName] = useState("")
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleSubmit  = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      await api.post("/parcels", {
        residentName,
        residentId,
        apartmentNo,
        parcelType,
        parcelDescription,
        courierService,
        status,
        arrivalDateTime,
        receivedByStaff,
        collectedDateTime,
        collectedByName

      })
      toast.success("Parcel added successfully!")
      navigate("/viewParcels")
    } catch (error) {
      console.log("error adding parcel", error)
      toast.error("Failed to add Parcel")
    } finally{
      setLoading(false)
    }
  }

return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6">
      {/* Back button */}
       <div className="mb-6">
        <Link
          to="/viewParcels"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          ← Back to Parcels
        </Link>
      </div>


      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Add New Parcel
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Resident Name
            </label>
            <input
              type="text"
              value={residentName}
              onChange={(e) => setResidentName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Resident ID
            </label>
            <input
              type="text"
              value={residentId}
              onChange={(e) => setResidentId(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Apartment No
            </label>
            <input
              type="text"
              value={apartmentNo}
              onChange={(e) => setApartmentNo(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Parcel Type
            </label>
            <input
              type="text"
              value={parcelType}
              onChange={(e) => setParcelType(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Parcel Description
          </label>
          <textarea
            value={parcelDescription}
            onChange={(e) => setParcelDescription(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Courier Service
            </label>
            <input
              type="text"
              value={courierService}
              onChange={(e) => setCourierService(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            >
              <option value="">Select status</option>
              <option value="Arrived">Pending</option>
              <option value="Collected">Collected</option>
              <option value="Pending">Removed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Arrival Date & Time
            </label>
            <input
              type="datetime-local"
              value={arrivalDateTime}
              onChange={(e) => setArrivalDateTime(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Collected Date & Time
            </label>
            <input
              type="datetime-local"
              value={collectedDateTime}
              onChange={(e) => setCollectedDateTime(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Received By Staff
            </label>
            <input
              type="text"
              value={receivedByStaff}
              onChange={(e) => setReceivedByStaff(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Collected By (Name)
            </label>
            <input
              type="text"
              value={collectedByName}
              onChange={(e) => setCollectedByName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition"
          >
            {loading ? "Adding..." : "Add Parcel"}
          </button>
        </div>
      </form>
    </div>
  );

}

export default KsAddParcel