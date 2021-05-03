const {userJoin, getUser, getUserId, userLeave, getRoomUsers} = require('./users')

let innerIo
// --- PRIVREMENO ---
const rooms = [
    'alpha',
    'beta',
    'gamma'
]

function sendFriendNotif(username) {
    console.log("Sending new friend notification to: ", username)

    let reciverId = getUserId(username)
    if(reciverId){
        let message = {
        }
        innerIo.to(reciverId).emit('newFriend', message)
    } else {
        console.log('Failed to find a reciver.')
    }
}


//socket io emit cheetsheet:
//https://socket.io/docs/v3/emit-cheatsheet/index.html
module.exports = {
    sendFriendNotif: sendFriendNotif,
    initializeIo: io => {
        innerIo = io
        io.on('connection', (socket) => {
            console.log('new connection')        

            //--- general logic ---
            socket.on('user-logged-in', ({creds}) => {
                console.log(`User logged in: ${creds.username}`)
                console.log(`Socket id: ${socket.id}`)
    
                userJoin(socket.id, creds.username, null)
                socket.emit('loggedIn')
                socket.broadcast.emit('status', {username: creds.username, status: true})
            })
            
            socket.on('get-status', ({username}) => {
                let id = getUserId(username)
                if(id){
                    socket.emit('status', {username: username, status: true})
                } else{
                    socket.emit('status', {username: username, status: false})
                }
            })
    
            //--- WebRTC signaling ---
            socket.on('offer', ({offer, reciver}) => {
                console.log('Offer event', reciver)
                
    
                let reciverId = getUserId(reciver)
                if(reciverId){
                    let message = {
                        offer: offer
                    }
                    io.to(reciverId).emit('message', message)
                } else {
                    console.log('Failed to find a reciver.')
                }
            })
    
            socket.on('answer', ({answer, reciver}) => {
                console.log('Answer event', reciver)
                let reciverId = getUserId(reciver)
                if(reciverId){
                    let message = {
                        answer: answer
                    }
                    io.to(reciverId).emit('message', message)
                } else {
                    console.log('Failed to find a reciver.')
                }
            })
    
            socket.on('new-ice-candidate', ({candidate, reciver}) => {
                console.log('New ICE candidate event', reciver)
                let reciverId = getUserId(reciver)
                if(reciverId){
                    let message = {
                        candidate: candidate
                    }
                    io.to(reciverId).emit('message', message)
                } else {
                    console.log('Failed to find a reciver.')
                }
            })
    
            // --- 1 on 1 call signaling ---
            socket.on('call-request', ({sender, reciver}) => {
                console.log(`${sender} calling ${reciver}.`)
                
                //TODO provjeri jesu li prijatelji
    
                let reciverId = getUserId(reciver)
                if(reciverId){
                    io.to(reciverId).emit('callRequest', sender)
                } else {
                    console.log('Failed to find a reciver.')
                }
            })
    
            socket.on('abort-call-request', ({sender, reciver}) => {
                console.log(`Aborting call to ${reciver}, from ${sender}.`)
                
                //TODO provjeri jesu li prijatelji
    
                let reciverId = getUserId(reciver)
                if(reciverId){
                    io.to(reciverId).emit('abortCallRequest', sender)
                } else {
                    console.log('Failed to find a reciver.')
                }
            })
    
            socket.on('call-accept', ({sender, reciver}) => {
                console.log(`${sender} accepted ${reciver}'s call.`)
    
                let reciverId = getUserId(reciver)
                if(reciverId){
                    io.to(reciverId).emit('callAccept', sender)
                } else {
                    console.log('Failed to find a reciver.')
                }
            })
    
            socket.on('call-denied', ({sender, reciver}) => {
                console.log(`${sender} denied ${reciver}'s call.`)
    
                let reciverId = getUserId(reciver)
                if(reciverId){
                    io.to(reciverId).emit('callDenied', sender)
                } else {
                    console.log('Failed to find a reciver.')
                }
            })

            socket.on('pc-setup', ({reciver}) => {
                console.log(`Telling reciver ${reciver} that pc is setup`)
                
                let reciverId = getUserId(reciver)
                if(reciverId){
                    io.to(reciverId).emit('otherPcSetUp')
                } else {
                    console.log('Failed to find a reciver.')
                }
            })

            socket.on('hang-up', ({reciver}) => {
                console.log(`Hanging up on ${reciver}`)
                
                let reciverId = getUserId(reciver)
                if(reciverId){
                    io.to(reciverId).emit('otherUserHangedUp')
                } else {
                    console.log('Failed to find a reciver.')
                }
            })
    
            // --- private chat logic ---
            socket.on('new-message', ({sender, reciver, msg}) =>{
                let reciverId = getUserId(reciver)
                let senderId = getUserId(sender)
                io.to(senderId).emit('newMessage', msg)
                if(reciverId){
                    console.log('Sending new msg to ', reciver)
                    io.to(reciverId).emit('newMessage', msg)
                } else {
                    console.log('Failed to find a reciver or sender.')
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
                    socket.broadcast.emit('status', {username: user.username, status: false})
                } else {
                    console.log('Someone disconnected!')
                }
            })
    
            //--- ROOM CALL SIGNALING LOGIC ---    
        })
    }
}