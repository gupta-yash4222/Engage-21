const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const sharedScreen = document.getElementById('screenStream')
const peer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

const myVideo = document.createElement('video')
myVideo.muted = true
let myVideoStream
let screenStream
const peers = {}
const peers_videos = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(mediaStream => {
    myVideoStream = mediaStream
    console.log(mediaStream)

    addVideoStream(myVideo, mediaStream)

    peer.on('call', call => {
        console.log("answering the call. hmmm...")
        call.answer(mediaStream)
        
        get_keys = call.provider._connections.keys()
        let hostID
        for(var id of get_keys)
        hostID = id

        peers[hostID] = call
        
        const video = document.createElement('video')

        peers_videos[hostID] = video

        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
        

        //console.log(call.provider._connections.keys())
    })

    socket.on('user-connected', userID => {
        console.log("User-Connected: ", userID)
        const fc = () => connectToNewUser(userID, mediaStream)
        timerid = setTimeout(fc, 1000)
    })

})

socket.on('user-disconnected', userID => {
    if(peers[userID]){
        console.log("gone user", userID)
        peers[userID].close()
        peers_videos[userID].remove()
    }

})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

const stopPlay = document.getElementById('stopPlay')
stopPlay.addEventListener('click', () => {
    enabled = myVideoStream.getVideoTracks()[0].enabled
    console.log(enabled)
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false
    }
    else{
        myVideoStream.getVideoTracks()[0].enabled = true
    }
})

const muteUnmute = document.getElementById('muteUnmute')
stopPlay.addEventListener('click', () => {
    enabled = myVideoStream.getAudioTracks()[0].enabled
    console.log(enabled)
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false
    }
    else{
        myVideoStream.getAudioTracks()[0].enabled = true
    }
})

const startScreenShare = document.getElementById('startScreenShare')
startScreenShare.addEventListener('click', () => {
    navigator.mediaDevices.getDisplayMedia({
        video: true
    }).then(mediaStream => {
        startScreenShare.disabled = true
        myScreenStream = mediaStream
        console.log(mediaStream)
        for(var track of mediaStream.getTracks()){
          console.log("track label", track.label)
        }

        addScreenStream(mediaStream)

        mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
            screenStream.remove()
            startScreenShare.disabled = false
        })
    })
})

if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
    startScreenShare.disabled = false;
  } else {
    errorMsg('getDisplayMedia is not supported');
  }


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

    console.log(userID)
    peers[userID] = call
    peers_videos[userID] = video
}

function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

function addScreenStream(stream){
    var screen = document.createElement('video')
    screen.srcObject = stream
    screen.addEventListener('loadedmetadata', () => {
        screen.play()
    })
    videoGrid.append(screen)
    screenStream = screen
}
