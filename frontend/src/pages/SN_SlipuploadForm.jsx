import React, { useState } from "react";

const OfflineSlipForm = () => {
  const [slip, setSlip] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const residentId = localStorage.getItem("residentId") || "";
  const phoneNumber = localStorage.getItem("phoneNumber") || "";
  const amountRent = localStorage.getItem("amountRent") || 0;
  const amountLaundry = localStorage.getItem("amountLaundry") || 0;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && ["image/png", "image/jpeg"].includes(selectedFile.type)) {
      setSlip(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setSlip(null);
      setPreview(null);
      setMessage("Please select a PNG or JPG image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slip) {
      setMessage("Please upload a slip file (PNG/JPG)");
      return;
    }

    const formData = new FormData();
    formData.append("residentId", residentId);
    formData.append("phoneNumber", phoneNumber);
    formData.append("amountRent", amountRent);
    formData.append("amountLaundry", amountLaundry);
    formData.append("slipFile", slip);

    try {
      const res = await fetch("http://localhost:5001/api/payments/offline", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("Offline payment submitted successfully! Awaiting admin verification.");
        setSlip(null);
        setPreview(null);
      } else {
        const err = await res.json();
        setMessage("Error: " + err.message);
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Payment Slip</h2>

      <p><strong>Resident ID:</strong> {residentId}</p>
      <p><strong>Phone:</strong> {phoneNumber}</p>
      <p><strong>Total:</strong> Rs.{Number(amountRent) + Number(amountLaundry)}</p>

      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="w-full mb-3 p-2 border rounded"
      />

      {preview && <img src={preview} alt="preview" className="w-40 h-40 object-cover rounded mb-3" />}

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
      >
        Submit Offline Payment
      </button>

      {message && <p className="mt-3 text-center text-gray-700">{message}</p>}
    </div>
  );
};

export default OfflineSlipForm;
