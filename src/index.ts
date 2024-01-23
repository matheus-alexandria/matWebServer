import * as net from "node:net";
import { newConn } from "./promiseSocket";

const socket = net.createServer({
  pauseOnConnect: true,
});

socket.on("connection", newConn);

socket.listen({ port: 1234, host: "127.0.0.1" });
