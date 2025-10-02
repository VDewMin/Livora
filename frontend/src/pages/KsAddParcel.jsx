import React, { useState, useEffect } from "react";
import {
  User,
  Home,
  Package,
  Truck,
  MapPin,
  Calendar,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import api from "../lib/axios.js";
import Sidebar from "../components/vd_sidebar.jsx"; 
import { useAuth } from "../context/vd_AuthContext";
import {getLocalDateTimeString} from "../lib/utils.js"

const KsAddParcel = () => {
  const { user } = useAuth(); 
  const [residentName, setResidentName] = useState("");
  const [apartmentNo, setApartmentNo] = useState("");
  const [parcelType, setParcelType] = useState("Normal");
  const [parcelDescription, setParcelDescription] = useState("");
  const [courierService, setCourierService] = useState("");
  const [locId, setLocId] = useState("");
  const [status, setStatus] = useState("Pending");
  const [arrivalDateTime, setArrivalDateTime] = useState(() => {
    //const now = new Date();
    //return now.toISOString().slice(0, 16);
    return getLocalDateTimeString();
  });
  const [receivedByStaff, setReceivedByStaff] = useState("");
  const [collectedDateTime, setCollectedDateTime] = useState("");
  const [collectedByName, setCollectedByName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.firstName && user?.lastName) {
      setReceivedByStaff(`${user.firstName} ${user.lastName}`);
    } else if (user?.name) {
      setReceivedByStaff(user.name);
    }
  }, [user]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      if (!/^L([1-9]|[1-4][0-9]|50)$/.test(locId)) {
        toast.error("Location ID must be between L1 and L50");
        setLoading(false);
        return;
      }

      try {
        await api.post("/parcels", {
          residentName,
          //residentId,
          apartmentNo,
          parcelType,
          parcelDescription,
          courierService,
          locId,
          status,
          receivedByStaff,
          collectedDateTime,
          collectedByName,
        });
        toast.success("Parcel added successfully!");
        navigate("/viewParcels");
      } catch (error) {
        console.log("error adding parcel", error);
        toast.error("Failed to add Parcel");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex h-screen">
      
      

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-32 h-32 border-4 border-blue-300 rounded-full"></div>
                <div className="w-24 h-24 border-4 border-indigo-300 rounded-full absolute"></div>
                <div className="w-16 h-16 border-4 border-purple-300 rounded-full absolute"></div>
              </div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Package className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {" "}
              Add New Parcel{" "}
            </h1>
            <p className="text-lg text-slate-600 mb-2">
              {" "}
              Fill in the details to register a new parcel delivery{" "}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-2xl p-6 space-y-8"
          >
            {/* Recipient Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {" "}
                  Recipient Details{" "}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-400" /> Apartment No
                  </label>
                  <input
                    type="text"
                    value={apartmentNo}
                     onChange={async (e) => {
                      const aptNo = e.target.value;
                      setApartmentNo(aptNo);

                      if (aptNo.trim() !== "") {
                        try {
                          const response = await fetch(`http://localhost:5001/api/users/resident/${aptNo}`);
                          if (response.ok) {
                            const data = await response.json();
                            setResidentName(data.firstName || ""); 
                          } else {
                            setResidentName("");
                          }
                        } catch (err) {
                          console.error("Error fetching resident:", err);
                          setResidentName("");
                        }
                      } else {
                        setResidentName("");
                      }
                    }}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g.: R501/P501"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" /> Resident Name
                  </label>
                  <input
                    type="text"
                    value={residentName}
                    readOnly
                 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Parcel Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Package className="w-4 h-4 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {" "}
                  Parcel Information{" "}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" /> Parcel Type
                  </label>
                  <select
                    value={parcelType}
                    onChange={(e) => setParcelType(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Documents">Documents</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-400" /> Courier Service
                  </label>
                  <input
                    type="text"
                    value={courierService}
                    onChange={(e) => setCourierService(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                    placeholder="eg: SITREK"
                  />
                </div>
              </div>

              {/* Parcel Description */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" /> Parcel
                  Description
                </label>
                <textarea
                  value={parcelDescription}
                  onChange={(e) => setParcelDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Brief description of the parcel"
                />
              </div>
            </div>

            {/* Location & Tracking */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {" "}
                  Location & Tracking{" "}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> Location ID
                  </label>
                  <input
                    type="text"
                    value={locId}
                    onChange={(e) => setLocId(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                    placeholder="eg: L1/L2/L3"
                    required
                    
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-400" /> Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Collected">Collected</option>
                    <option value="Removed">Removed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" /> Arrival Date &
                    Time
                  </label>
                  <input
                    type="datetime-local"
                    value={arrivalDateTime}
                    onChange={(e) => setArrivalDateTime(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" /> Received By Staff
                  </label>
                  <input
                    type="text"
                    value={receivedByStaff}
                   // onChange={(e) => setReceivedByStaff(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
                   // placeholder="Staff member name"
                   readOnly
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              {loading ? "Adding Parcel..." : "Add Parcel"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KsAddParcel;