const UserController = require('../controllers/UserController')
const ChatController = require('../controllers/ChatController')
const NotificationController = require('../controllers/NotificationsController')
const GroupController = require('../controllers/GroupController')

const AuthMiddlware = require('../authentication')
const {cpUpload} = require('../storage')

module.exports = (app) => {
    app.post('/register',
        UserController.register
    )
    app.post('/login',
        UserController.login
    )
    app.post('/automaticLogin',
        AuthMiddlware.authentication,
        UserController.automaticLogin
    )

    app.post('/newProfileImg',
        cpUpload,
        AuthMiddlware.authentication,
        UserController.setNewProfileImg
    )
    app.post('/newTheme',
        AuthMiddlware.authentication,
        UserController.setTheme
    )

    app.post('/acceptFriendRequest',
        AuthMiddlware.authentication,
        NotificationController.acceptFriendRequest
    )
    app.post('/getNotifications',
        AuthMiddlware.authentication,
        NotificationController.getNotifications
    )
    app.post('/readNotificiation',
        AuthMiddlware.authentication,
        NotificationController.readNotification
    )
    app.post('/removeNotification',
        AuthMiddlware.authentication,
        NotificationController.removeNotifcation
    )
    app.post('/sendFriendRequest',
        AuthMiddlware.authentication,
        NotificationController.sendFriendRequest
    )
    app.post('/getFriends',
        AuthMiddlware.authentication,
        UserController.getFriends
    )
    app.post('/getUser',
        UserController.getUser
    )

    app.post('/createGroup', 
        AuthMiddlware.authentication,
        GroupController.createGroup
    )
    app.post('/deleteGroup', 
        AuthMiddlware.authentication,
        GroupController.deleteGroup
    )
    app.post('/getGroups', 
        AuthMiddlware.authentication,
        GroupController.getGroups
    )
    app.post('/getGroupMembers', 
        AuthMiddlware.authentication,
        GroupController.getGroupMembers
    )
    app.post('/sendGroupRequest', 
        AuthMiddlware.authentication,
        GroupController.sendGroupRequest
    )
    app.post('/acceptGroupRequest',
        AuthMiddlware.authentication, 
        GroupController.acceptGroupRequest
    )

    app.post('/getMessages',
        ChatController.getMessages
    )
    app.post('/sendMessage',
        ChatController.sendMessage
    )
}