const usersFromRedRoom = [];
const usersFromBlueRoom = [];
const messagesFromRedRoom = [];
const messagesFromBlueRoom = [];
const roomTypes = ['red', 'blue'];

const roomsEvents = (currentSocket, socketServer) => {
    currentSocket.on('user-disconnected', ({userId, roomType}) => {
        if (!roomTypes.includes(roomType)) return

        if (roomType === 'red') {
            const userIndexFromRedRoom = usersFromRedRoom.findIndex((id) => id === userId)

            usersFromRedRoom.splice(userIndexFromRedRoom, 1)

            socketServer.of('/rooms').to('red').emit('update-room', {
                usersConnected: usersFromRedRoom.length,
                messages: messagesFromRedRoom
            })
        }

        if (roomType === 'blue') {
            const userIndexFromBlueRoom = usersFromBlueRoom.findIndex((id) => id === userId)

            usersFromBlueRoom.splice(userIndexFromBlueRoom, 1)

            socketServer.of('/rooms').to('blue').emit('update-room', {
                usersConnected: usersFromBlueRoom.length,
                messages: messagesFromBlueRoom
            })
        }
    })

    currentSocket.on('user-connected', ({userId, roomType}, _callback) => {
        if (!roomTypes.includes(roomType)) return
        
        if (roomType === 'red' && !usersFromRedRoom.includes(userId)) usersFromRedRoom.push(userId)
        if (roomType === 'blue' && !usersFromBlueRoom.includes(userId)) usersFromBlueRoom.push(userId)

        currentSocket.join(roomType)

        socketServer.of('/rooms').to(roomType).emit('update-room', {
            usersConnected: roomType === 'red' ? usersFromRedRoom.length : usersFromBlueRoom.length,
            messages: roomType === 'red' ? messagesFromRedRoom : messagesFromBlueRoom
        })
    })

    currentSocket.on('message', ({ userId, message, roomType }) => {
        if (!roomTypes.includes(roomType)) return

        if (roomType === 'red') {
            messagesFromRedRoom.push({ userId, message })
            socketServer.of('/rooms').to('red').emit('update-room', { messages: messagesFromRedRoom, usersConnected: usersFromRedRoom.length})
        }

        if (roomType === 'blue') {
            messagesFromBlueRoom.push({ userId, message })
            socketServer.of('/rooms').to('blue').emit('update-room', { messages: messagesFromBlueRoom, usersConnected: usersFromBlueRoom.length})
        }
    })
}

module.exports = { roomsEvents };