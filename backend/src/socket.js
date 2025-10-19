import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
   // console.log("User connected:", socket.id);

    socket.on("sendNotification", (data) => {
      io.emit("receiveNotification", data); // broadcast to all connected clients
    });

    socket.on("disconnect", () => {
      //console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
