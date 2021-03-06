import h from './helper.js'

window.addEventListener('load', () => {

    //When the 'Create room" is button is clicked
    document.getElementById( 'create-room' ).addEventListener( 'click', ( e ) => {
        e.preventDefault()

        let roomName = document.querySelector( '#room-name' ).value
        let yourName = document.querySelector( '#your-name' ).value

        if ( roomName && yourName ) {
            //remove error message, if any
            document.querySelector( '#err-msg' ).innerHTML = ""

            //save the user's name in sessionStorage

            sessionStorage.setItem( 'room-name', roomName)
            sessionStorage.setItem( 'username', yourName )

            //create room link
            let roomLink = `${ location.origin }?room=${ roomName }+${ ROOM_ID }`

            //show message with link to room
            document.querySelector( '#room-created' ).innerHTML = `Room successfully created. Click <a href='${ roomLink }'>here</a> to enter room. 
                Share the room link with your partners.`

            //empty the values
            document.querySelector( '#room-name' ).value = ''
            document.querySelector( '#your-name' ).value = ''

            //window.location.assign(roomLink)
            //alert('Room Successfully created')
        }

        else {
            document.querySelector( '#err-msg' ).innerHTML = "All fields are required"
        }
    } )


    //When the 'Join a Room' button is clicked.
    document.getElementById('join-room').addEventListener('click', e => {
        e.preventDefault()

        let id = document.querySelector('#room-id').value

        if(!id){
            document.querySelector('#err-msg-join').innerHTML = "Please input the room ID"
        }

        else {
            document.querySelector('#err-msg-join').innerHTML = ""
            
            let joinLink = `${ location.origin }?room=${id}`

            document.querySelector('#room-id').value = ''
            window.location.assign(joinLink)
        }
    })


    //When the 'Enter room' button is clicked.
    document.getElementById( 'enter-room' ).addEventListener( 'click', ( e ) => {
        e.preventDefault()

        let name = document.querySelector( '#username' ).value
        
        if ( name ) {
            //remove error message, if any
            document.querySelector( '#err-msg-username' ).innerHTML = ""

            //save the user's name in sessionStorage
            sessionStorage.setItem( 'username', name )

            //reload room
            location.reload()
        }

        else {
            document.querySelector( '#err-msg-username' ).innerHTML = "Please input your name"
        }
    } )

    //When the chat icon is clicked
    document.getElementById( 'toggle-chat-pane' ).addEventListener( 'click', ( e ) => {

        let chatElem = document.querySelector( '#chat-pane' )
        let listElem = document.querySelector('#participants-list')
        let mainSecElem = document.querySelector( '#main-section' )

        if ( chatElem.classList.contains( 'chat-opened' ) ) {
            chatElem.setAttribute( 'hidden', true )
            //mainSecElem.classList.remove( 'col-md-9' )
            //mainSecElem.classList.add( 'col-md-12' )
            chatElem.classList.remove( 'chat-opened' )
        }

        else {

            if(listElem.classList.contains( 'list-opened' )) {
                listElem.setAttribute( 'hidden', true )
                listElem.classList.remove( 'list-opened' )
            }

            chatElem.attributes.removeNamedItem( 'hidden' )
            //mainSecElem.classList.remove( 'col-md-12' )
            //mainSecElem.classList.add( 'col-md-9' )
            chatElem.classList.add( 'chat-opened' )
        }

        //remove the 'New' badge on chat icon (if any) once chat is opened.
        setTimeout( () => {
            if ( document.querySelector( '#chat-pane' ).classList.contains( 'chat-opened' ) ) {
                h.toggleChatNotificationBadge();
            }
        }, 300 )
    } )

    //Participants list
    document.getElementById('toggle-participants-list').addEventListener('click', e => {
        e.preventDefault()
        console.log("see us")

        let listElem = document.querySelector('#participants-list')
        let chatElem = document.querySelector( '#chat-pane' )

        if(listElem.classList.contains('list-opened')) {
            listElem.setAttribute('hidden', true)
            listElem.classList.remove('list-opened')
        }

        else {
            if(chatElem.classList.contains( 'chat-opened' )) {
                chatElem.setAttribute( 'hidden', true )
                chatElem.classList.remove( 'chat-opened' )
            }

            listElem.attributes.removeNamedItem('hidden')
            listElem.classList.add('list-opened')

        }

    })

})