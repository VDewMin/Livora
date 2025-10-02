import React, { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const OfflineSlipForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  const [slip, setSlip] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && ["image/png", "image/jpeg"].includes(selectedFile.type)) {
      setSlip(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setSlip(null);
      setPreview(null);
      toast.error("Please select a PNG or JPG image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slip) {
      toast.error("Please upload a slip file (PNG/JPG)");
      setTimeout(() => navigate("/resident/billing"), 2000); // redirect after 2s
      return;
    }

    const formData = new FormData();
    formData.append("residentId", data.residentId);
    formData.append("apartmentNo", data.apartmentNo);
    formData.append("residentName", data.residentName);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("amountRent", data.amountRent);
    formData.append("amountLaundry", data.amountLaundry);
    formData.append("slipFile", slip);

    try {
      const res = await fetch("http://localhost:5001/api/payments/offline", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Offline payment submitted successfully! Awaiting admin verification.");
      } else {
        const err = await res.json();
        toast.error("Error: " + err.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setTimeout(() => navigate("/resident/billing"), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Payment Slip</h2>

      <form onSubmit={handleSubmit}>
        <label className="block mb-1 font-medium">Apartment No</label>
        <input
          type="text"
          value={data.apartmentNo}
          readOnly
          className="w-full mb-3 p-2 border rounded bg-gray-100"
        />

        <label className="block mb-1 font-medium">Resident Name</label>
        <input
          type="text"
          value={data.residentName}
          readOnly
          className="w-full mb-3 p-2 border rounded bg-gray-100"
        />

        <label className="block mb-1 font-medium">Phone Number</label>
        <input
          type="text"
          value={data.phoneNumber}
          readOnly
          className="w-full mb-3 p-2 border rounded bg-gray-100"
        />

        <label className="block mb-1 font-medium">Rent Amount</label>
        <input
          type="number"
          value={data.amountRent}
          readOnly
          className="w-full mb-3 p-2 border rounded bg-gray-100"
        />

        <label className="block mb-1 font-medium">Laundry Amount</label>
        <input
          type="number"
          value={data.amountLaundry}
          readOnly
          className="w-full mb-3 p-2 border rounded bg-gray-100"
        />

        <p className="mb-3 font-semibold">
          Total: Rs. {Number(data.amountRent) + Number(data.amountLaundry)}
        </p>

        <label className="block mb-1 font-medium">Upload Slip (PNG/JPG)</label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="w-full mb-3 p-2 border rounded"
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-40 h-40 object-cover rounded mb-3"
          />
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
        >
          Submit Offline Payment
        </button>
      </form>
    </div>
  );
};

export default OfflineSlipForm;
