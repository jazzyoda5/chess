import { io } from "socket.io-client";

export const socket = io.connect(process.env.REACT_APP_SOCKET, {
  "sync disconnect on unload": true,
});
