import { LoaderIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { Link, useNavigate } from 'react-router';
import { useParams } from 'react-router';
import React from 'react';

const KsParcelDetail = () => {
  const [parcel, setParcel] = useState(null);
  const [collectedDateTime, setCollectedDateTime] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0,16); // format for datetime-local
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  console.log({ id });

  const formatDateTimeLocal = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0,16); // "YYYY-MM-DDTHH:mm"
  };


  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const res = await api.get(`/parcels/${id}`);
        setParcel(res.data);

      } catch (error) {
        console.log('Error in fetching parcel', error);
        toast.error('Failed to fetch the parcel');
      } finally {
        setLoading(false);
      }
    };
    fetchParcel();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this parcel?')) return;

    try {
      await api.delete(`/parcels/${id}`);
      toast.success('Parcel deleted successfully!');
      navigate('/viewParcels');
    } catch (error) {
      console.log('error in handleDelete', error);
      toast.error('Failed to delete Parcel');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/parcels/${id}`, parcel);
      toast.success('Parcel updated successfully!');
      navigate('/viewParcels');
    } catch (error) {
      console.log('error updating parcel', error);
      toast.error('Failed to update Parcel');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !parcel) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6">
      {/* Top buttons */}
      <div className="flex justify-between mb-6">
        <Link
          to="/viewParcels"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          ← Back to Parcels
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Delete Parcel
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Parcel Details</h2>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Resident Name & ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Resident Name
            </label>
            <input
              type="text"
              value={parcel.residentName || ''}
              readOnly
              onChange={(e) =>
                setParcel({ ...parcel, residentName: e.target.value })
              }
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
              value={parcel.residentId || ''}
              readOnly
              onChange={(e) =>
                setParcel({ ...parcel, residentId: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Apartment No & Parcel Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Apartment No
            </label>
            <input
              type="text"
              value={parcel.apartmentNo || ''}
              readOnly
              onChange={(e) =>
                setParcel({ ...parcel, apartmentNo: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Parcel Type
            </label>
            <input
              type="text"
              value={parcel.parcelType || ''}
              readOnly
              onChange={(e) =>
                setParcel({ ...parcel, parcelType: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Parcel Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Parcel Description
          </label>
          <textarea
            value={parcel.parcelDescription || ''}
            onChange={(e) =>
              setParcel({ ...parcel, parcelDescription: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            rows="3"
          />
        </div>

        {/* Courier Service & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Courier Service
            </label>
            <input
              type="text"
              value={parcel.courierService || ''}
              readOnly
              onChange={(e) =>
                setParcel({ ...parcel, courierService: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Status
            </label>
            <select
              value={parcel.status || ''}
              onChange={(e) => {
                const newStatus = e.target.value;
                setParcel({
                  ...parcel,
                  status: newStatus,
                  collectedDateTime: newStatus === "Collected" ? new Date().toISOString() : parcel.collectedDateTime
                });
              }}
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            >
              <option value="">Select status</option>
              <option value="Pending">Pending</option>
              <option value="Collected">Collected</option>
              <option value="Removed">Removed</option>
            </select>

          </div>
        </div>

        {/* Arrival & Collected DateTime */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Arrival Date & Time
            </label>
            <input
              type="datetime-local"
              value={formatDateTimeLocal(parcel.arrivalDateTime)}
              readOnly
              onChange={(e) =>
                setParcel({ ...parcel, arrivalDateTime: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Collected Date & Time
            </label>
            <input
              type="datetime-local"
              value={formatDateTimeLocal(parcel.collectedDateTime)}
              onChange={(e) =>
                setParcel({
                  ...parcel,
                  // save as full ISO string (UTC safe)
                  collectedDateTime: new Date(e.target.value).toISOString(),
                })
              }
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />

          </div>
        </div>

        {/* Received & Collected By */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Received By Staff
            </label>
            <input
              type="text"
              value={parcel.receivedByStaff || ''}
              readOnly
              onChange={(e) =>
                setParcel({ ...parcel, receivedByStaff: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Collected By (Name)
            </label>
            <input
              type="text"
              value={parcel.collectedByName || ''}
              onChange={(e) =>
                setParcel({ ...parcel, collectedByName: e.target.value })
              }
              className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default KsParcelDetail;
