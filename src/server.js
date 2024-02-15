const { Server } = require('socket.io');
const express = require('express');
const { createServer } = require('http')
const { feedEvents } = require('./events/feed.event');
const { roomsEvents } = require('./events/rooms.event');

const PORT = process.env.PORT || 3000;
const app = express();

app.get('/ping', (_, res) => res.send('pong'));

app.get('/', (_, res) => res.sendFile(__dirname + '/public/home.html'));
app.get('/red', (_, res) => res.sendFile(__dirname + '/public/red-room.html'));
app.get('/blue', (_, res) => res.sendFile(__dirname + '/public/blue-room.html'));

const server = createServer(app);
const socketIoServer = new Server(server, {cors: { origin: '*' }});

socketIoServer.of('/home').on('connection', (socket) => {
    console.log(`Client ${socket.id} connected on HOME resource`);

    feedEvents(socket, socketIoServer);
});

socketIoServer.of('/rooms').on('connection', (socket) => {
    console.log(`Client ${socket.id} connected on ROOMS resource`);

    roomsEvents(socket, socketIoServer);
});


server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))