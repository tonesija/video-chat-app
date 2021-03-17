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

        socket.on('offer', ({offer, sender, reciver}) => {
            console.log('Offer event', sender, reciver)
            let message = {
                offer: offer,
                sender: sender,
                reciver: reciver
            }
            socket.broadcast.emit('message', {message})
        })

        socket.on('answer', ({answer, sender, reciver}) => {
            console.log('Answer event', sender, reciver)
            let message = {
                answer: answer,
                sender: sender,
                reciver: reciver
            }
            socket.broadcast.emit('message', {message})
        })

        socket.on('new-ice-candidate', ({candidate, sender, reciver}) => {
            console.log('New ICE candidate event')
            let message = {
                iceCandidate: candidate,
                sender: sender,
                reciver: reciver
            }
            socket.broadcast.emit('message', {message})
        })


        // --- ROOM LOGIC ---
        socket.on('join-room', ({roomName, username}) => {
            console.log(username + ' joined room ' + roomName)
            
            const user = userJoin(socket.id, username, roomName)
            socket.join(roomName)

            socket.broadcast.to(roomName).emit('userJoinedRoom', user)

            //socket.broadcast.to(roomName).emit('roomUsers', getRoomUsers(roomName))
            io.to(roomName).emit('roomUsers', getRoomUsers(roomName))
        })

        socket.on('get-rooms', () => {
            socket.emit('rooms', rooms)
        })
        
        socket.on('get-room-users', (room) => {
            let users = getRoomUsers(room)

            socket.broadcast.to(room).emit('roomUsers', users)
        })

        socket.on('leave-room', room => {
            const user = userLeave(socket.id)

            if(user) {
                io.to(user.room).emit('userDisconnected', user)
                socket.broadcast.to(room).emit('roomUsers', getRoomUsers(user.room))
                console.log(user.username + ' left room ' + room)
            } else {
                console.log('Someone disconnected!')
            }

            
        })
        socket.on('disconnect', function() {
            const user = userLeave(socket.id)
            console.log('user:', user)

            if(user) {
                io.to(user.room).emit('userDisconnected', user)
                socket.broadcast.to(user.room).emit('roomUsers', getRoomUsers(user.room))
                console.log(user.username + ' disconnect!')
            } else {
                console.log('Someone disconnected!')
            }
        })

        //--- ROOM CALL SIGNALING LOGIC ---
        
    })
}