const UserController = require('../controllers/UserController')
const ChatController = require('../controllers/ChatController')
const NotificationController = require('../controllers/NotificationsController')

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

    app.post('/acceptFriendRequest',
        NotificationController.acceptFriendRequest
    )
    app.post('/getNotifications',
        NotificationController.getNotifications
    )
    app.post('/readNotificiation',
        NotificationController.readNotification
    )
    app.post('/removeNotification',
        NotificationController.removeNotifcation
    )
    app.post('/sendFriendRequest',
        NotificationController.sendFriendRequest
    )
    app.post('/addFriend',
        NotificationController.addFriend
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