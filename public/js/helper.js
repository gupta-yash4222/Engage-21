export default {

    addVideoStream(video, stream, videoGrid){
        console.log(stream)

        if(stream.name) console.log("name of the streamer currently is - ", stream.name)

        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        videoGrid.append(video)
    },

    addScreenStream(stream){

        let screen = document.createElement('video')
        screen.setAttribute('width', 712)
        screen.setAttribute('height', 400)

        screen.srcObject = stream
        screen.addEventListener('loadedmetadata', () => {
            screen.play()
        })

        document.getElementById('shared-screen').appendChild(screen)
        return screen
    },

    getQString( url = '', keyToReturn = '' ) {
        url = url ? url : location.href
        let queryStrings = decodeURIComponent( url ).split( '#', 2 )[0].split( '?', 2 )[1]

        if ( queryStrings ) {
            let splittedQStrings = queryStrings.split( '&' )

            if ( splittedQStrings.length ) {
                let queryStringObj = {}

                splittedQStrings.forEach( function ( keyValuePair ) {
                    let keyValue = keyValuePair.split( '=', 2 )

                    if ( keyValue.length ) {
                        queryStringObj[keyValue[0]] = keyValue[1]
                    }
                } )

                return keyToReturn ? ( queryStringObj[keyToReturn] ? queryStringObj[keyToReturn] : null ) : queryStringObj
            }

            return null
        }

        return null
    }, 

    addChat( data, senderType ) {
        let chatMsgDiv = document.querySelector( '#chat-messages' )
        let contentAlign = 'justify-content-end'
        let senderName = 'You'
        let msgBg = 'bg-white'

        if ( senderType === 'remote' ) {
            contentAlign = 'justify-content-start'
            senderName = data.sender
            msgBg = ''

            this.toggleChatNotificationBadge()
        }

        if(senderType === 'left-meeting') {
            contentAlign = 'justify-content-center'
            senderName = data.sender
            msgBg = 'bg-info'
            data.msg = data.sender + ' left the meeting'

            this.toggleChatNotificationBadge()
        }

        if(senderType === 'enter-meeting') {
            contentAlign = 'justify-content-center'
            senderName = data.sender
            msgBg = 'bg-info'
            data.msg = data.sender + ' entered the meeting'

            this.toggleChatNotificationBadge()
        }

        let infoDiv = document.createElement( 'div' )
        infoDiv.className = 'sender-info'
        if(senderType !== 'left-meeting' && senderType !== 'enter-meeting') infoDiv.innerHTML = `${ senderName } - ${ moment().format( 'Do MMMM, YYYY h:mm a' ) }`
        else infoDiv.innerHTML = `${ moment().format( 'Do MMMM, YYYY h:mm a' ) }`

        let colDiv = document.createElement( 'div' )
        colDiv.className = `col-10 card chat-card msg ${ msgBg }`
        //colDiv.innerHTML = xssFilters.inHTMLData( data.msg ).autoLink( { target: "_blank", rel: "nofollow"})
        colDiv.innerHTML = data.msg

        let rowDiv = document.createElement( 'div' )
        rowDiv.className = `row ${ contentAlign } mb-2`


        colDiv.appendChild( infoDiv )
        rowDiv.appendChild( colDiv )

        chatMsgDiv.appendChild( rowDiv )

        /**
         * Move focus to the newly added message but only if:
         * 1. Page has focus
         * 2. User has not moved scrollbar upward. This is to prevent moving the scroll position if user is reading previous messages.
         */
        if ( this.pageHasFocus ) {
            rowDiv.scrollIntoView()
        }
    },


    toggleChatNotificationBadge() {
        if ( document.querySelector( '#chat-pane' ).classList.contains( 'chat-opened' ) ) {
            document.querySelector( '#new-chat-notification' ).setAttribute( 'hidden', true )
        }

        else {
            document.querySelector( '#new-chat-notification' ).removeAttribute( 'hidden' )
        }
    },


    addParticipant(username) {
        console.log(username)

        let userDiv = document.querySelector('#participant')

        let rowDiv = document.createElement( 'div' )
        rowDiv.className = `row justify-content-center mb-2`

        let colDiv = document.createElement( 'div' )
        colDiv.className = `col-10 bg-light`
        colDiv.innerHTML = username

        rowDiv.appendChild( colDiv )
        userDiv.appendChild( rowDiv )
    },


    saveRecordedStream( stream, user ) {
        let blob = new Blob( stream, { type: 'video/webm' } )

        let file = new File( [blob], `${ user }-${ moment().unix() }-record.webm` )

        saveAs( file )
    },

}