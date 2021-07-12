import h from './helper.js'

const socket = io('/')


window.addEventListener('load', () => {

    const ROOM_ID = h.getQString(location.href, "room")
    const username = sessionStorage.getItem('username')
    const roomName = sessionStorage.getItem('room-name')

    if(!ROOM_ID){
        document.querySelector( '#room-create' ).attributes.removeNamedItem( 'hidden' )
    }

    else if(!username){
        document.querySelector( '#username-set' ).attributes.removeNamedItem( 'hidden' )
    }

    else{
        let commElem = document.getElementsByClassName('room-comm')

        for(let i = 0; i < commElem.length; i++){
            commElem[i].attributes.removeNamedItem( 'hidden' )
            console.log("done")
        }

        const roomName = ROOM_ID.split('+')[0]
        console.log(roomName)

        //const socket = io('/')
        const videoGrid = document.getElementById('video-grid')
        const peer = new Peer(undefined, {
            host: '/',
            port: '3001'
        })
        
        const myVideo = document.createElement('video')
        myVideo.muted = true
        myVideo.setAttribute('width', 300)
        myVideo.setAttribute('height', 300)

        
        let myVideoStream     // stores the current user's mediastream
        let myScreenStream    // stores the current user's screen mediastream
        let screenStream      // stores the current user's screen-video element
        
        const peers_names = {}   // mapping userID to respective user's name
        const peers_calls = {}   // mapping userID to respective calls 
        const peers_videos = {}  // mapping userID to respective "video" element
        const peers_screens = {} // mapping userID to respective "screen" elements
        let sharedScreen

        const sendMsg = (msg) => {
            let data = {
                room: ROOM_ID,
                msg: msg,
                sender: username
            }

            //emit chat message-details
            socket.emit( 'chat', data )

            //add local chat
            h.addChat( data, 'local')
        }
        
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(mediaStream => {
            myVideoStream = mediaStream
        
            h.addVideoStream(myVideo, mediaStream, videoGrid)
        
            peer.on('call', call => {
                console.log("answering the call. hmmm...")
                call.answer(mediaStream)
                
                let get_keys = call.provider._connections.keys()
                let hostID
                for(var id of get_keys)
                hostID = id
        
                if(!peers_calls[hostID]){
                    peers_calls[hostID] = call
                }
                
                const video = document.createElement('video')
                video.setAttribute('width', 300)
                video.setAttribute('height', 300)
                let count = 0
        
                call.on('stream', userVideoStream => {
                    console.log("here!!!!!!@##@@")
                    count++ 

                    console.log(count)

                    if(count==1 && peers_videos[hostID]){
                        sharedScreen = h.addScreenStream(userVideoStream)
                    }

                    else{
                        h.addVideoStream(video, userVideoStream, videoGrid)
                        if(!peers_videos[hostID]) peers_videos[hostID] = video
                    }
                })

            })
        
            socket.on('user-connected', (userID, username) => {
                console.log("User-Connected: ", userID)
                peers_names[userID] = username
                h.addParticipant(username)
                const fc = () => connectToNewUser(userID, mediaStream)
                let timerid = setTimeout(fc, 1000)
            })
        
        })
        
        socket.on('user-disconnected', (userID, username) => {
            if(peers_calls[userID]){
                peers_calls[userID].close()
                peers_videos[userID].remove()
            }

            h.addChat({ sender: username, msg: "Left"}, 'left-meeting')
        
        })

        socket.on('chat', data => {
            h.addChat(data, 'remote')
        })

        socket.on('screen-stream-ended', () => {
            console.log("screen stopped!!")
            sharedScreen.remove()
        })

        
        peer.on('open', id => {
            socket.emit('join-room', ROOM_ID, id, username)
        })
        
        // Toggling user's video on/off
        document.getElementById('toggle-video').addEventListener('click', (e) => {
            e.preventDefault()

            let enabled = myVideoStream.getVideoTracks()[0].enabled

            let elem = document.getElementById('toggle-video')
            let icon = document.getElementById('video-icon')
            let textElem = document.getElementById('stop-play')

            if(enabled){
                myVideoStream.getVideoTracks()[0].enabled = false
                icon.classList.remove('fa-video')
                icon.classList.add('fa-video-slash')
                textElem.innerHTML = "Start Video"
                elem.setAttribute( 'title', 'Start Video' )
            }

            else{
                myVideoStream.getVideoTracks()[0].enabled = true
                icon.classList.remove('fa-video-slash')
                icon.classList.add('fa-video')
                textElem.innerHTML = "Stop Video"
                elem.setAttribute( 'title', 'Stop Video' )
            }
        })
        
        // Muting-Unmuting user's audio
        document.getElementById('toggle-audio').addEventListener('click', (e) => {
            e.preventDefault()

            let enabled = myVideoStream.getAudioTracks()[0].enabled

            let elem = document.getElementById('toggle-audio')
            let icon = document.getElementById('audio-icon')
            let textElem = document.getElementById('mute-unmute')

            if(enabled){
                myVideoStream.getAudioTracks()[0].enabled = false
                icon.classList.remove('fa-microphone')
                icon.classList.add('fa-microphone-slash')
                textElem.innerHTML = "Unmute"
                elem.setAttribute( 'title', 'Unmute' )
            }

            else{
                myVideoStream.getAudioTracks()[0].enabled = true
                icon.classList.remove('fa-microphone-slash')
                icon.classList.add('fa-microphone')
                textElem.innerHTML = "Mute"
                elem.setAttribute( 'title', 'Mute' )
            }
        })


        //Chat textarea
        document.getElementById( 'chat-input' ).addEventListener( 'keypress', ( e ) => {
            if ( e.which === 13 && ( e.target.value.trim() ) ) {
                e.preventDefault()

                sendMsg( e.target.value )

                setTimeout( () => {
                    e.target.value = ''
                }, 50 )
            }
        } )

        
        // Sharing the user's screen with other peers
        const startScreenShare = document.getElementById('startScreenShare')
        startScreenShare.addEventListener('click', () => {
            navigator.mediaDevices.getDisplayMedia({
                video: true
            }).then(mediaStream => {

                startScreenShare.disabled = true
                myScreenStream = mediaStream

                /******** DEBUGGER STARTS ***********/
                //console.log(typeof mediaStream)
                mediaStream.streamKind = "screen"
                //console.log(typeof mediaStream)
                //console.log(mediaStream)
                for(var track of mediaStream.getTracks()){
                  track.streamKind = "screen"
                  //console.log(track)
                  //console.log("track label", track.label == "screen:0:0")
                }
                /******** DEBUGGER ENDS ************/
        
                screenStream = h.addScreenStream(mediaStream)
        
                for(var id in peer.connections){
                    if(id) peer.call(id, mediaStream)
                }
        
                mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
                    screenStream.remove()
                    startScreenShare.disabled = false
                    //socket.emit('screen-stream-ended', ROOM_ID)
                    socket.emit('screen-stream-ended')
                })
            })
        })
        
        if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
            startScreenShare.disabled = false;
          } else {
            errorMsg('getDisplayMedia is not supported');
        }
        
        
        function connectToNewUser(userID, mediaStream){
            var call = peer.call(userID, mediaStream)

            const video = document.createElement('video')
            video.setAttribute('width', 300)
            video.setAttribute('height', 300)
        
            call.on('stream', userVideoStream => {
                h.addVideoStream(video, userVideoStream, videoGrid)
            })
            
            call.on('close', () => {
                video.remove()
            })
        
            console.log(userID)
            peers_calls[userID] = call
            peers_videos[userID] = video
        }



    }


})
