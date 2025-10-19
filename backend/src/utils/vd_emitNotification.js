// src/helpers/emitNotification.js
import { getIO } from "../socket.js";

export const emitNotification = (event, data) => {
  try {
    const io = getIO();
    io.emit(event, data);
  } catch (err) {
    console.error("⚠️ Socket not ready:", err.message);
  }
};
