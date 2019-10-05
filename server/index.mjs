import http from 'http';
import express from 'express';
import SocketIO from 'socket.io';

console.log(typeof SocketIO);

// Config
const port = 4000;

// Static HTTP
const app = express();
const server = http.createServer(app);
app.use(express.static('public'));
app.use(express.static('build'));

// Sockets
const io = SocketIO(server);
io.on('connection', () => console.log('socket connected'));

server.listen(port, () => console.log(`Server listening on port ${port}`));
