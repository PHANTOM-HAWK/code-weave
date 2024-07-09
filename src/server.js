const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./Actions");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const userSocketMap = {};

function getAllConnectedClients(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (!room) return [];

  return Array.from(room).map((socketId) => {
    return {
      socketId,
      username: userSocketMap[socketId], // Retrieve username using socketId
    };
  });
}

const connectedClients = new Set(); // Set to track connected clients

io.on("connection", (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
    console.log(userName); // Log the username received

    if (!connectedClients.has(userName)) {
      connectedClients.add(userName);
      userSocketMap[socket.id] = userName;
      socket.join(roomId);

      const clients = getAllConnectedClients(roomId);
      console.log(clients);

      clients.forEach(({ socketId, userName: clientUserName }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          clients,
          userName,
          socketId: socket.id,
        });
      });
    }
  });
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        userName: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
