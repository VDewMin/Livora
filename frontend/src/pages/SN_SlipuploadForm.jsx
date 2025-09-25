import React, { useState } from "react";
import toast from "react-hot-toast";

const OfflineSlipForm = () => {
  const [residentId, setResidentId] = useState("");
  const [apartmentNo, setApartmentNo] = useState("");
  const [residentName, setResidentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amountRent, setAmountRent] = useState(0);
  const [amountLaundry, setAmountLaundry] = useState(0);
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

    if (!residentId || !apartmentNo || !residentName || !phoneNumber) {
      toast.error("Please fill all required fields!");
      return;
    }
    if (!slip) {
      toast.error("Please upload a slip file (PNG/JPG)");
      return;
    }

    const formData = new FormData();
    formData.append("residentId", residentId);
    formData.append("apartmentNo", apartmentNo);
    formData.append("residentName", residentName);
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
        toast.success("Offline payment submitted successfully! Awaiting admin verification.");
        setSlip(null);
        setPreview(null);
        setResidentId("");
        setApartmentNo("");
        setResidentName("");
        setPhoneNumber("");
        setAmountRent(0);
        setAmountLaundry(0);
      } else {
        const err = await res.json();
        toast.error("Error: " + err.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Payment Slip</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={residentId}
          onChange={(e) => setResidentId(e.target.value)}
          placeholder="Resident ID"
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          value={apartmentNo}
          onChange={(e) => setApartmentNo(e.target.value)}
          placeholder="Apartment No"
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          value={residentName}
          onChange={(e) => setResidentName(e.target.value)}
          placeholder="Resident Name"
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="number"
          value={amountRent}
          onChange={(e) => setAmountRent(e.target.value)}
          placeholder="Rent Amount"
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="number"
          value={amountLaundry}
          onChange={(e) => setAmountLaundry(e.target.value)}
          placeholder="Laundry Amount"
          className="w-full mb-3 p-2 border rounded"
        />

        <p className="mb-3">
          <strong>Total:</strong> Rs.{Number(amountRent) + Number(amountLaundry)}
        </p>

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
