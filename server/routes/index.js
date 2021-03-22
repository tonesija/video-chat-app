const UserController = require('../controllers/UserController')
const ChatController = require('../controllers/ChatController')


module.exports = (app) => {
    app.post('/register',
        UserController.register
    )
    app.post('/login',
        UserController.login
    )
    app.post('/automaticLogin',
        UserController.automaticLogin
    )

    app.post('/addFriend',
        UserController.addFriend
    )
    app.post('/getFriends',
        UserController.getFriends
    )

    app.post('/getMessages',
        ChatController.getMessages
    )
    app.post('/sendMessage',
        ChatController.sendMessage
    )
}