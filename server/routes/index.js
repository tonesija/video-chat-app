const UserController = require('../controllers/UserController')
const ChatController = require('../controllers/ChatController')

const {cpUpload} = require('../storage')

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

    app.post('/newProfileImg',
        cpUpload,
        UserController.setNewProfileImg
    )
    app.post('/newTheme',
        UserController.setTheme
    )

    app.post('/addFriend',
        UserController.addFriend
    )
    app.post('/getFriends',
        UserController.getFriends
    )
    app.post('/getUser',
        UserController.getUser
    )

    app.post('/getMessages',
        ChatController.getMessages
    )
    app.post('/sendMessage',
        ChatController.sendMessage
    )
}