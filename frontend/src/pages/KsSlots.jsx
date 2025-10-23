import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import api from "../lib/axios.js";
import { MapPin } from "lucide-react";

// Connect to backend Socket.IO server
const socket = io("http://localhost:5001");

const KsSlots = () => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const loadSlots = async () => {
      try {
        const res = await api.get("/parcels/slots");
        setSlots(res.data);
      } catch (err) {
        console.error("Error loading slots:", err);
      }
    };

    loadSlots();

    socket.on("slotUpdated", (update) => {
      setSlots((prev) =>
        prev.map((s) => {
          if (s.locId !== update.locId) return s;

          let newStatus;
          if (update.status === "Pending" ) {
            newStatus = "Occupied";
          } else if (update.status === "Collected" || update.status === "Removed") {
            newStatus = "Available";
          } else {
            newStatus = s.status; 
          }

          return { ...s, status: newStatus };
        })
      );
    });

    
    return () => {
      socket.off("slotUpdated");
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <MapPin className="text-blue-500" /> Slots Availability
      </h1>

      <div className="grid grid-cols-10 gap-3">
        {slots.map((slot) => (
          <div
            key={slot.locId}
            className={`p-4 rounded-lg font-semibold text-center cursor-pointer transition-colors duration-200 ${
              slot.status === "Occupied"
                ? "bg-red-500 text-white"
                : "bg-green-400 text-white hover:bg-green-500"
            }`}
          >
            {slot.locId}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KsSlots;
