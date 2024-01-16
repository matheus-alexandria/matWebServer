import * as net from "node:net";

type TCPConn = {
  socket: net.Socket;
  reader: null | {
    resolve: (value: Buffer) => void,
    reject: (reason: Error) => void
  }
}

async function soRead(conn: TCPConn): Promise<Buffer> { return Buffer.from('') };
async function soWrite(conn: TCPConn, data: Buffer): Promise<void> {};

function newConn(socket: net.Socket) {
  console.log(`new connection ${socket.remoteAddress} // ${socket.remotePort}`);

  socket.on("end", () => {
    console.log("EOF");
  });

  socket.on("data", (data: Buffer) => {
    console.log("data: ", data);
    socket.write(data);

    if (data.toString("utf-8").substring(0, data.length - 1) === "quit") {
      console.log("closing.");
      socket.end();
    }
  });
}

const socket = net.createServer();

socket.on("error", (err) => {
  throw err.message;
});
socket.on("connection", newConn);

socket.listen({ port: 1234, host: "127.0.0.1" });
