const { Server } = require('socket.io');
const { createServer } = require('http')
const { pingRoute } = require('./routes/ping.route');
const { feedEvents } = require('./events/feed.event');
const { roomsEvents } = require('./events/rooms.event');

const PORT = process.env.PORT || 3000;
const server = createServer(pingRoute);
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