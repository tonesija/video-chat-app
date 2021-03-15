//const first
//const second
module.exports = (io) => {
    console.log('Initializing socket-io!!!')
    io.on('connection', (socket) => {
        console.log('new connection')

        socket.on('offer', offer => {
            console.log('Offer event')
            let message = {
                offer: offer
            }
            socket.broadcast.emit('message', message)
        })

        socket.on('answer', answer => {
            console.log('Answer event')
            let message = {
                answer: answer
            }
            socket.broadcast.emit('message', message)
        })

        socket.on('new-ice-candidate', candidate => {
            console.log('New ICE candidate event')
            let message = {
                iceCandidate: candidate
            }
            socket.broadcast.emit('message', message)
        })

        socket.on('disconnect', function() {
            console.log('Got disconnect!')
        })
    })
}