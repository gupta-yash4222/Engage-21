export default {

    addScreenStream(stream){
        var screen = document.getElementById('gum-local')
        screen.srcObject = stream
        /*
        screen.addEventListener('loadedmetadata', () => {
            screen.play()
        })
        videoGrid.append(screen)
        */
        return screen
    }

}