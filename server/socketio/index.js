const {userJoin, getUser, getUserId, userLeave, getRoomUsers} = require('./users')

// --- PRIVREMENO ---
const rooms = [
    'alpha',
    'beta',
    'gamma'
]


//socket io emit cheetsheet:
//https://socket.io/docs/v3/emit-cheatsheet/index.html
module.exports = (io) => {
    console.log('Initializing socket-io!!!')
    io.on('connection', (socket) => {
        console.log('new connection')        

        //--- general logic ---
        socket.on('user-logged-in', ({creds}) => {
            console.log(`User logged in: ${creds.username}`)
            console.log(`Socket id: ${socket.id}`)

            userJoin(socket.id, creds.username, null)
        })



        //--- WebRTC signaling ---
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
            console.log('New ICE candidate event', sender, reciver)
            let message = {
                iceCandidate: candidate,
                sender: sender,
                reciver: reciver
            }
            socket.broadcast.emit('message', {message})
        })

        // --- private chat logic ---
        socket.on('new-message', ({username, msg}) =>{
            let reciver = getUserId(username)
            if(reciver){
                console.log('Sending new msg to ', reciver)
                io.to(reciver).emit('newMessage', msg)
            } else {
                console.log('Failed to find a reciver.')
            }
            
        })


        // --- room logic ---
        socket.on('join-room', ({roomName, username}) => {
            console.log(username + ' joined room ' + roomName)
            
            const user = userJoin(socket.id, username, roomName)
            socket.join(roomName)

            socket.broadcast.to(roomName).emit('userJoinedRoom', user)

            //socket.broadcast.to(roomName).emit('roomUsers', getRoomUsers(roomName))
            io.to(roomName).emit('roomUsers', getRoomUsers(roomName))
        })

        socket.on('user-joined-call', ({username}) => {
            console.log('User joined call: ', username)
            const user = getUser(socket.id)
            socket.broadcast.emit('userJoinedCall', user)
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
                console.log(user.username + ' disconnect!')
            } else {
                console.log('Someone disconnected!')
            }
        })

        //--- ROOM CALL SIGNALING LOGIC ---
        
    })
}