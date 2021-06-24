const express = require('express');
const app = express();
const http = require('http')
server = http.Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const stream = require('./stream.js')
const ExpressPeerServer = require('peer').ExpressPeerServer
const PeerServer = require('peer').PeerServer;
const peer_server = PeerServer({port: 3001, path: '/'});

app.set('view-engine', 'ejs')
app.use('/public', express.static('./public'))
app.use('/peer', ExpressPeerServer(server, {
    allow_discovery: true
}))

app.get('/get', (req, res) => {
    res.write("hello there")
    res.end()
})

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:roomID', (req, res) => {
    res.render('room.ejs', { roomID: req.params.roomID })
})

io.on('connection', stream.stream)

server.listen(3000, () => {console.log("Listening to port no. 3000 .....")})