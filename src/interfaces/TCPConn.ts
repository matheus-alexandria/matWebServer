import { Socket } from "node:net";

export interface TCPConn {
  socket: Socket;
  ended: boolean;
  err: null | Error;
  reader: null | {
    resolve: (value: Buffer) => void,
    reject: (reason: Error) => void
  }
}
