import * as net from "node:net";
import { serverClient } from "./promiseSocket";

const socket = net.createServer({
  pauseOnConnect: true,
});

socket.on("connection", serverClient);

socket.listen({ port: 1234, host: "127.0.0.1" });
