const stream = (socket) => {
    socket.on('join-room', (roomID, userID) => {
        console.log(roomID, userID)
        socket.join(roomID)
        socket.broadcast.to(roomID).emit('user-connected', userID)

        socket.on('disconnect', () => {
            socket.broadcast.to(roomID).emit('user-disconnected', userID)
        })
    })
}

const peers = []

module.exports.stream = stream
module.exports.peers = peers