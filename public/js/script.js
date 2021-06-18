const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const peer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(mediaStream => {
    addVideoStream(myVideo, mediaStream)

    peer.on('call', call => {
        console.log("answering the call. hmmm...")
        call.answer(mediaStream)

        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userID => {
        console.log("User-Connected: ", userID)
        const fc = () => connectToNewUser(userID, mediaStream)
        timerid = setTimeout(fc, 1000)
    })

})

socket.on('user-disconnected', userID => {
    if(peers[userID]) peers[userID].close()
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})


function connectToNewUser(userID, mediaStream){

    //console.log(typeof(mediaStream))

    var call = peer.call(userID, mediaStream)
    const video = document.createElement('video')

    //console.log(call)
    //console.log("Here we are!!")

    call.on('stream', userVideoStream => {
        //console.log(`${userID} video getting added`)
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        //console.log("goone")
        video.remove()
    })

    peers[userID] = call
}

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}
