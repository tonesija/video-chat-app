const {userJoin, getUser, userLeave, getRoomUsers} = require('./users')

// --- PRIVREMENO ---
const rooms = [
    'alpha',
    'beta',
    'gamma'
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


        // --- ROOM LOGIC ---
        socket.on('join-room', ({roomName, username}) => {
            console.log(username + ' joined room ' + roomName)
            
            const user = userJoin(socket.id, username, roomName)
            socket.join(roomName)

            socket.broadcast.to(roomName).emit('user-joined-room', user)

            socket.broadcast.to(roomName).emit('room-users', getRoomUsers(roomName))
        })

        socket.on('get-rooms', () => {
            socket.emit('rooms', rooms)
        })


        socket.on('leave-room', room => {
            const user = userLeave(socket.id)

            if(user) {
                io.to(user.room).emit('user-disconnected', user)
                socket.broadcast.to(roomName).emit('room-users', getRoomUsers(user.room))
                console.log(user.username + ' left room ' + room)
            } else {
                console.log('Someone disconnected!')
            }

            
        })
        socket.on('disconnect', function() {
            const user = userLeave(socket.id)

            if(user) {
                io.to(user.room).emit('user-disconnected', user)
                socket.broadcast.to(roomName).emit('room-users', getRoomUsers(user.room))
                console.log(user.username + ' disconnect!')
            } else {
                console.log('Someone disconnected!')
            }
        })

        //--- ROOM CALL SIGNALING LOGIC ---
        
    })
}