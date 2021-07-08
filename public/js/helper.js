export default {

    addVideoStream(video, stream, videoGrid){
        console.log(stream)
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        videoGrid.append(video)
    },

    addScreenStream(stream){
        //var screen = document.getElementById('gum-local')
        //screen.attributes.removeNamedItem('hidden')

        var screen = document.createElement('video')
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
    }

}