import * as net from "node:net";
import { TCPConn } from "./interfaces/TCPConn";

export function soInit(socket: net.Socket): TCPConn {
  const conn: TCPConn = {
    socket: socket,
    reader: null,
    ended: false,
    err: null,
  };

  socket.on("data", (data: Buffer) => {
    console.assert(conn.reader);
    // pause the 'data' event until the next read.
    conn.socket.pause();
    // fulfill the promise of the current read.
    conn.reader!.resolve(data);
    conn.reader = null;
  });

  socket.on("end", () => {
    conn.ended = true;

    if (conn.reader) {
      conn.reader.resolve(Buffer.from(""));
      conn.reader = null;
    }
  });

  socket.on("error", (err) => {
    conn.err = err;

    if (conn.reader) {
      conn.reader.reject(err);
      conn.reader = null;
    }
  });

  return conn;
}

export async function soRead(conn: TCPConn): Promise<Buffer> {
  console.assert(!conn.reader); // no concurrent calls
  return new Promise((resolve, reject) => {
    if (conn.err) {
      reject(conn.err);
      return;
    }
    if (conn.ended) {
      resolve(Buffer.from("")); // EOF
      return;
    }
    // save the promise callbacks
    conn.reader = { resolve: resolve, reject: reject };
    // and resume the 'data' event to fulfill the promise later.
    conn.socket.resume();
  });
}

export async function soWrite(conn: TCPConn, data: Buffer): Promise<void> {
  console.assert(data.length > 0);

  return new Promise((resolve, reject) => {
    if (conn.err) {
      reject(conn.err);
      return;
    }

    conn.socket.write(data, (err?: Error) => {
      if (err) {
        reject();
      }
      resolve();
    });
  });
}

export async function newConn(socket: net.Socket) {
  console.log(`new connection ${socket.remoteAddress} // ${socket.remotePort}`);

  const TCPConn = soInit(socket);

  while (true) {
    const data = await soRead(TCPConn);

    if (data.length === 0) {
      console.log('ending connection.');
      break;
    }

    if (data.toString() === 'quit\n') {
        console.log('data: ', data);
        await soWrite(TCPConn, Buffer.from('Bye.'));
        console.log(`ending ${socket.remoteAddress} connection.`);
        break;
    }

    console.log('data: ', data);
    const echoData = Buffer.from(`Imitation robot: ${data}`);
    await soWrite(TCPConn, echoData);
  }
}