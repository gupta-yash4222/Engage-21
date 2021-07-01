import h from './helper.js'

const socket = io('/')
//const peers = require('./../stream.js').default
const videoGrid = document.getElementById('video-grid')
const sharedScreen = document.getElementById('screenStream')
const peer = new Peer(undefined, {
    host: '/',
    port: '3001'
})

const myVideo = document.createElement('video')
myVideo.muted = true
let myVideoStream
let myScreenStream
let screenStream
const peers_calls = {}
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
        
        let get_keys = call.provider._connections.keys()
        let hostID
        for(var id of get_keys)
        hostID = id

        peers_calls[hostID] = call
        
        const video = document.createElement('video')

        peers_videos[hostID] = video

        call.on('stream', userVideoStream => {
            console.log("stream stream stream", userVideoStream)
            if(userVideoStream.streamKind && userVideoStream.streamKind == "screen") addScreenStream(userVideoStream)
            else addVideoStream(video, userVideoStream)
        })
        

        //console.log(call.provider._connections.keys())
    })

    socket.on('user-connected', userID => {
        console.log("User-Connected: ", userID)
        const fc = () => connectToNewUser(userID, mediaStream)
        let timerid = setTimeout(fc, 1000)
    })

})

socket.on('user-disconnected', userID => {
    if(peers_calls[userID]){
        console.log("gone user", userID)
        peers_calls[userID].close()
        peers_videos[userID].remove()
    }

})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

const stopPlay = document.getElementById('stopPlay')
stopPlay.addEventListener('click', () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled
    //console.log(enabled)
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false
    }
    else{
        myVideoStream.getVideoTracks()[0].enabled = true
    }
})

const muteUnmute = document.getElementById('muteUnmute')
muteUnmute.addEventListener('click', () => {
    let enabled = myVideoStream.getAudioTracks()[0].enabled
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
        console.log(typeof mediaStream)
        mediaStream.streamKind = "screen"
        console.log(typeof mediaStream)
        console.log(mediaStream)
        for(var track of mediaStream.getTracks()){
          track.streamKind = "screen"
          console.log(track)
          console.log("track label", track.label == "screen:0:0")
        }

        screenStream = h.addScreenStream(mediaStream)

        for(var id in peer.connections){
            console.log(mediaStream)
            if(id) peer.call(id, mediaStream)
        }

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
    peers_calls[userID] = call
    peers_videos[userID] = video
}

function addVideoStream(video, stream){
    for(var track of stream.getTracks()){
        console.log("video track labels", track.label)
    }
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

