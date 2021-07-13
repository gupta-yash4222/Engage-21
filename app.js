if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

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

//const PeerServer = require('peer').PeerServer;
//const peer_server = PeerServer({port: 3001, path: '/'})

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

const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/engage-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to mongoose"))

app.get('/get', (req, res) => {
    res.write("hello there")
    res.end()
})

app.get('/', (req, res) => {
    //res.redirect(`/${uuidV4()}`)
    res.render(__dirname + '/views/room.ejs', { roomID: uuidV4()})
})

const userRouter = require('./routes/user')
app.use('/api', userRouter)

app.get('/:roomID', (req, res) => {
    res.render('room.ejs', { roomID: req.params.roomID })
})

io.on('connection', stream.stream)

const port = process.env.PORT || 3000

server.listen(port, () => {console.log(`Listening to port no. ${port} .....`)})