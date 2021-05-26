const UserController = require('../controllers/UserController')
const ChatController = require('../controllers/ChatController')
const NotificationController = require('../controllers/NotificationsController')
const GroupController = require('../controllers/GroupController')

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
    app.post('/getFriends',
        UserController.getFriends
    )
    app.post('/getUser',
        UserController.getUser
    )

    app.post('/createGroup', 
        GroupController.createGroup
    )
    app.post('/deleteGroup', 
        GroupController.deleteGroup
    )
    app.post('/getGroups', 
        GroupController.getGroups
    )
    app.post('/getGroupMembers', 
        GroupController.getGroupMembers
    )
    app.post('/sendGroupRequest', 
        GroupController.sendGroupRequest
    )
    app.post('/acceptGroupRequest', 
        GroupController.acceptGroupRequest
    )

    app.post('/getMessages',
        ChatController.getMessages
    )
    app.post('/sendMessage',
        ChatController.sendMessage
    )
}