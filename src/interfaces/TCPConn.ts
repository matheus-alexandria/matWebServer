import { Socket } from "node:net";

export interface TCPConn {
  socket: Socket;
  reader: null | {
    resolve: (value: Buffer) => void,
    reject: (reason: Error) => void
  }
}
