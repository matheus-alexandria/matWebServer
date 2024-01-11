import * as net from 'node:net';

function newConn(socket: net.Socket) {
  console.log(`new connection ${socket.remoteAddress} // ${socket.remotePort}`)
}

const socket = net.createServer();
socket.on('connection', newConn);

socket.listen({ port: 1234, host: '127.0.0.1'});

