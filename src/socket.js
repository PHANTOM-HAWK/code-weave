import { io } from "socket.io-client";

export const initSocket = async () => {
  const backendUrl = "http://localhost:5000";

  if (!backendUrl) {
    console.error("Backend URL is not defined");
    throw new Error("Backend URL is not defined");
  }

  const options = {
    reconnectionAttempts: Infinity,
    timeout: 20000, // increase timeout to 20 seconds
    transports: ["websocket"],
  };

  console.log("Backend URL:", backendUrl);

  try {
    const socket = io(backendUrl, options);

    socket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("Reconnection attempt:", attemptNumber);
    });

    return socket;
  } catch (error) {
    console.error("Error initializing socket:", error);
    throw error; // Throw the error so it can be caught by the caller
  }
};
