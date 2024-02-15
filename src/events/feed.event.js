const feed = [];
const users = [];
const usersInteractions = [];

const feedEvents = (currentSocket, socketServer) => {
    currentSocket.on('user-disconnected', (userId) => {
        const userIndex = users.findIndex((id) => id === userId)

        if (userIndex !== -1) users.splice(userIndex, 1)

        socketServer.of('/home').emit('update-users-connected', users.length)
    })

    currentSocket.on('user-connected', (userId, _callback) => {
        if (!users.includes(userId)) users.push(userId)

        socketServer.of('/home').emit('update-users-connected', users.length)
        socketServer.of('/home').emit('update-interactions', usersInteractions.length)
    })

    currentSocket.on('load-feed', (_arg, callback) => callback(feed))

    currentSocket.on('publish', (arg, _callback) => {
        feed.push({ id: feed.length + 1, img: arg.img, likes: 0, dislikes: 0 })

        socketServer.of('/home').emit('update-feed', feed)
    })

    currentSocket.on('like', ({publicationId, userId}, _callback) => {
        const userInteractionIndex = usersInteractions.findIndex((interaction) =>
            interaction.userId === userId && interaction.publicationId === publicationId
        )
        const userInteraction = usersInteractions[userInteractionIndex]
        const userAlreadyLiked = userInteraction && userInteraction.like
        
        if (userAlreadyLiked) return

        const publicationIndex = feed.findIndex((publi) => publi.id === publicationId)
        const publicationExists = publicationIndex !== -1

        if (publicationExists) {
            const publication = feed[publicationIndex]
            const userAlreadyDisliked = userInteraction && !userInteraction.like

            if (userAlreadyDisliked) publication.dislikes -= 1
            publication.likes += 1

            if (!userInteraction) usersInteractions.push({ publicationId, userId, like: true })
            if (userInteraction) usersInteractions[userInteractionIndex] = { publicationId, userId, like: true }

            feed[publicationIndex] = publication

            socketServer.of('/home').emit('update-interactions', usersInteractions.length)
            socketServer.of('/home').emit('update-feed', feed)
        }
    })

    currentSocket.on('dislike', ({publicationId, userId}, _callback) => {
        const userInteractionIndex = usersInteractions.findIndex((interaction) =>
            interaction.userId === userId && interaction.publicationId === publicationId
        )
        const userInteraction = usersInteractions[userInteractionIndex]
        const userAlreadyDisliked = userInteraction && !userInteraction.like
        
        if (userAlreadyDisliked) return

        const publicationIndex = feed.findIndex((publi) => publi.id === publicationId)
        const publicationExists = publicationIndex !== -1

        if (publicationExists) {
            const publication = feed[publicationIndex]
            const userAlreadyLiked = userInteraction && userInteraction.like

            if (userAlreadyLiked) publication.likes -= 1
            publication.dislikes += 1

            if (!userInteraction) usersInteractions.push({ publicationId, userId, like: false })
            if (userInteraction) usersInteractions[userInteractionIndex] = { publicationId, userId, like: false }

            feed[publicationIndex] = publication

            socketServer.of('/home').emit('update-interactions', usersInteractions.length)
            socketServer.of('/home').emit('update-feed', feed)
        }
    })
}

module.exports = { feedEvents };