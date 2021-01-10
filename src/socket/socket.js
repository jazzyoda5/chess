import { io } from "socket.io-client";

export const socket = io.connect("http://localhost:5000", {
  "sync disconnect on unload": true,
});