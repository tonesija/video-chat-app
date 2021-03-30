const UserController = require('../controllers/UserController')
const ChatController = require('../controllers/ChatController')

const multer = require('multer')
const path = require('path')

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../static/images/profile-images'))
    },
    filename: (req, file, cb) => {
        cb(null, removeSpaces(file.originalname))
    },
    onError: (err, next) => {
        console.log('FILE ALREADY WRITTEN, SKIPPING')
        next()
    }
})

function removeSpaces (path) {
    return path.replace(/\s/g , "-");
}

const upload = multer({
    storage: storage
})

var cpUpload = upload.fields([{name: 'img', maxCount: 1}, 
                {name: 'token', maxCount: 1}])


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