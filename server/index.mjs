import http from 'http';
import express from 'express';
import SocketIO from 'socket.io';
import bootstrapClient from './event-handlers';

// Config
const port = 4000;

// Static HTTP
const app = express();
const server = http.createServer(app);
app.use(express.static('public'));
app.use(express.static('build'));

// Sockets
const io = SocketIO(server);
io.on('connection', (socket) => {
  bootstrapClient(socket);
  console.log('socket connected');
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
