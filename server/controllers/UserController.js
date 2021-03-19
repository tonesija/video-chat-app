const {User} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config')

const {sendResponse, sendError} = require('../util')


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

//formatiraj korisnika za odgovor (ukloni lozinku)
function formatUser(user){
  return {
    username: user.username,
    email: user.email
  }
}

module.exports = {
  async register (req, res) {
    //username, email i password
    let creds = req.body
    if(!creds.username || !creds.password || !creds.email){
      sendError(res, 'Greška kod formata zahtjeva.', 400)
      return
    }
    

    console.log(`Registriram korsinika ${creds.username}`)

    try {
      try {
        const dbUser = await User.create(creds)
        
        sendResponse(res, {
          user: formatUser(dbUser),
          token: jwtSingUser(dbUser.toJSON())
        })
      } catch (e) {
        sendError(res, 'Korisničko ime ili e-mail već postoje.', 400)
      }
    } catch (e) {
      sendError(res, 'Neočekivana greška.', 500)
    }
  },

  async login (req, res) {
    //username i password
    let creds = req.body
    if(!creds.username || !creds.password){
      sendError(res, 'Greška kod formata zahtjeva.', 400)
      return
    }

    console.log(`Prijavljijem korisnika ${creds.username}`)

    try {
      try {
        let dbUser = await User.findOne({
          where: {
            username: creds.username
          }
        })
        
        //kasnije ce se koristiti bcrypt
        if(!dbUser || dbUser.password !== creds.password) {
          sendError(res, 'Neispravno korisničko ime ili lozinka.', 400)
          return
        }

        sendResponse(res, {
          user: formatUser(dbUser),
          token: jwtSingUser(dbUser.toJSON())
        })
      } catch (e) {
        sendError(res, 'Neočekivana greška.', 500)
      }
    } catch (e) {
      sendError(res, 'Neočekivana greška.', 500)
    }
  }
}
