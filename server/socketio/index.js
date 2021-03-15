//----- PRIVREMENO -----
const rooms = [
    {name: 'alpha'},
    {name: 'beta'},
    {name: 'gamma'}
]
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

        socket.on('join-room', ({roomName, username}) => {
            console.log(username + ' joined room ' + roomName)
            socket.join(roomName)
            io.to(roomName).emit('user-joined-room', username)
        })

        socket.on('get-rooms', () => {
            socket.emit('rooms', rooms)
        })

        socket.on('disconnecting', function() {
            for(let room of socket.rooms){
                io.to(room).emit('user-disconected')
            }
            console.log('Scoket is disconecting!')
            console.log('Affected rooms: ', socket.rooms)
        })

        socket.on('disconnect', function() {
            console.log('Got disconnect!')
        })
    })
}