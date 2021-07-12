const rooms = {}

const stream = (socket) => {
    socket.on('join-room', (roomID, userID, username) => {

        if(rooms[roomID]){
            rooms[roomID].push(userID)
        }
        else{
            rooms[roomID] = [userID]
        }

        console.log(roomID, userID, username)

        socket.join(roomID)
        socket.broadcast.to(roomID).emit('user-connected', userID, username)

        socket.on('disconnect', () => {
            socket.broadcast.to(roomID).emit('user-disconnected', userID, username)
        })

        socket.on('chat', (data) => {
            socket.broadcast.to(roomID).emit('chat', { sender: data.sender, msg: data.msg })
        })

        socket.on('screen-stream-ended', () => {
            socket.broadcast.to(roomID).emit('screen-stream-ended')
        })

    })

    /*
    socket.on('screen-stream-ended', (roomID) => {
        socket.join(roomID)
        socket.broadcast.to(roomID).emit('screen-stream-ended')
    })
    */
}

module.exports.stream = stream
module.exports.rooms = rooms