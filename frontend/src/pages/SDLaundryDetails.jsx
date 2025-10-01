import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios.js';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js'; // Import html2pdf

const SDLaundryDetails = () => {
  const { schedule_id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const detailsRef = useRef(null); // Ref to target the details div for PDF

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axiosInstance.get(`/laundry/schedule/${schedule_id}`);
        setRequest(response.data);
      } catch (error) {
        toast.error('Failed to load request details');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [schedule_id]);

  const generatePDF = () => {
    if (detailsRef.current) {
      html2pdf()
        .from(detailsRef.current)
        .set({
          filename: `laundry_request_${schedule_id}.pdf`,
          margin: [10, 10, 10, 10],
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .save();
      toast.success('PDF generated and downloaded!');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!request) {
    return (
      <div className="text-center py-10">
        <h2>Request Not Found</h2>
        <button onClick={() => navigate('/')} className="btn btn-secondary mt-4">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-indigo-200 py-10">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-teal-800 mb-4">Laundry Request Details</h2>
        <div ref={detailsRef} className="space-y-2">
          <p><strong>Schedule ID:</strong> {request.schedule_id}</p>
          <p><strong>Resident Name:</strong> {request.resident_name}</p>
          <p><strong>Resident ID:</strong> {request.resident_id}</p>
          <p><strong>Weight:</strong> {request.weight} kg</p>
          <p><strong>Service Type:</strong> {request.service_type}</p>
          <p><strong>Time Duration:</strong> {request.time_duration} hours</p>
          <p><strong>Total Cost (LKR):</strong> {request.total_cost.toLocaleString()}</p>
          <p><strong>Status:</strong> {request.status}</p>
          <p><strong>Created At:</strong> {new Date(request.created_at).toLocaleString()}</p>
          <p><strong>Completed At:</strong> {request.completion_date ? new Date(request.completion_date).toLocaleString() : 'N/A'}</p>
        </div>
        <div className="mt-6 flex space-x-4">
          <button onClick={generatePDF} className="btn btn-primary">
            Generate PDF
          </button>
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SDLaundryDetails;