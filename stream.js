const rooms = {}

const stream = (socket) => {
    socket.on('join-room', (roomID, userID) => {

        if(rooms[roomID]){
            rooms[roomID].push(userID)
        }
        else{
            rooms[roomID] = [userID]
        }

        console.log(roomID, userID)

        socket.join(roomID)
        socket.broadcast.to(roomID).emit('user-connected', userID)

        socket.on('disconnect', () => {
            socket.broadcast.to(roomID).emit('user-disconnected', userID)
        })
    })

    socket.on('screen-stream-ended', (roomID) => {
        socket.join(roomID)
        socket.broadcast.to(roomID).emit('screen-stream-ended')
    })
}

module.exports.stream = stream
module.exports.rooms = rooms