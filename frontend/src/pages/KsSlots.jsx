import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import api from "../lib/axios.js";
import { MapPin } from "lucide-react";

const socket = io("http://localhost:5001");

const KsSlots = () => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const loadSlots = async () => {
      const res = await api.get("/parcels/slots");
      setSlots(res.data);
    };
    loadSlots();

    socket.on("slotUpdated", (update) => {
      setSlots((prev) =>
        prev.map((s) =>
          s.locId === update.locId ? { ...s, status: update.status === "Occupied" ? "Occupied" : "Available" } : s
        )
      );
    });

    return () => {
      socket.off("slotUpdated");
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <MapPin className="text-blue-500" /> Slot Availability
      </h1>

      <div className="grid grid-cols-10 gap-3">
        {slots.map((slot) => (
          <div
            key={slot.locId}
            className={`p-4 rounded-lg font-semibold text-center cursor-pointer ${
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
