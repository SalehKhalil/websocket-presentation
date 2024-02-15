const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

app.get('/ping', (_, res) => res.send('pong'));

app.get('/', (_, res) => res.sendFile(__dirname + '/public/home.html'));
app.get('/red', (_, res) => res.sendFile(__dirname + '/public/red-room.html'));
app.get('/blue', (_, res) => res.sendFile(__dirname + '/public/blue-room.html'));

app.listen(PORT, () => console.log(`Client is running on port ${PORT}`))