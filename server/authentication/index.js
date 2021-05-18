const jwt = require('jsonwebtoken')
const config = require('../config')

//vraća jwt
function jwtSingUser (dbUser) {
  return jwt.sign(dbUser, config.authentication.jwtSecret, {
      expiresIn: '7d'
  })
}

//vraća korisnika
function jwtVerifyUser (token) {
  return jwt.verify(token, config.authentication.jwtSecret)
}

module.exports = {
  jwtSingUser,
  jwtVerifyUser
}