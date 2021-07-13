
const express = require('express');
const app = express();
const http = require('http')
server = http.Server(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
})
const { v4: uuidV4 } = require('uuid')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const stream = require('./stream.js')
const ExpressPeerServer = require('peer').ExpressPeerServer

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
    const PeerServer = require('peer').PeerServer;
    const peer_server = PeerServer({port: 3001, path: '/'})
}

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use('/public', express.static('./public'))
app.use('/peerjs', ExpressPeerServer(server, {
    debug: true, 
    allow_discovery: true
}))
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

app.get('/get', (req, res) => {
    res.write("hello there")
    res.end()
})

app.get('/', (req, res) => {
    //res.redirect(`/${uuidV4()}`)
    res.render(__dirname + '/views/room.ejs', { roomID: uuidV4(), appStatus: process.env.NODE_ENV})
})

app.get('/:roomID', (req, res) => {
    res.render('room.ejs', { roomID: req.params.roomID })
})

io.on('connection', stream.stream)

const port = process.env.PORT || 3000

server.listen(port, () => {console.log(`Listening to port no. ${port} .....`)})