const multer = require('multer')
const path = require('path')

const {getFileName} = require('../util')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../static/images/profile-images'))
  },
  filename: (req, file, cb) => {
      cb(null, getFileName(file.originalname))
  },
  onError: (err, next) => {
      next()
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1000 * 1000
  }
})

var cpUpload = upload.fields([{name: 'img', maxCount: 1}, 
              {name: 'token', maxCount: 1}])
var cpUploadGroup = upload.fields([{name: 'img', maxCount: 1}, 
              {name: 'token', maxCount: 1},
              {name: 'groupId', maxCount: 1}])

module.exports = {
  cpUpload,
  cpUploadGroup
}