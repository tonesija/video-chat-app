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
  },

  async automaticLogin (req, res) {
    let token = req.body.token

    try {
      console.log('token: ', token)
      let user = jwtVerifyUser(token)

      if(user){
        sendResponse(res, {
          user: user,
          token: token
        })
        return
      } else {
        sendError(res, 'Greška u automatskoj autentifikaciji.', 400)
        return
      }
    } catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },

  async addFriend (req, res) {
    let token = req.body.token
    let otherUsername = req.body.otherUsername
    
    if(!token){
      sendError(res, 'Greška u autentifikaciji.', 400)
      return
    }
    
    try {
      let user = jwtVerifyUser(token)

      if(!user){
        sendError(res, 'Greška u autentifikaciji.', 400)
        return
      }

      if(user.username === otherUsername){
        sendError(res, 'Ne možete dodati sebe za prijatelja.', 400)
        return
      }

      user = await User.findOne({
        where: {
          username: user.username
        },
        include: {
          model: User,
          as: 'Friend'
        }
      })
      let friends = user.Friend

      for(let friend of friends){
        if(friend.username === otherUsername){
          sendError(res, 'Taj korisnik vam je već prijatelj.', 400)
          return
        }
      }

      let otherUser = await User.findOne({
        where: {
          username: otherUsername
        }
      })

      if(otherUser){
        await user.addFriend(otherUser)
        await otherUser.addFriend(user)
        sendResponse(res, {
          message: `${otherUsername} je sada vaš prijatelj.`
        })
      } else {
        sendError(res, 'Taj korisnik ne postoji.', 400)
      }
      
    } catch(e) {
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },

  async getFriends (req, res) {
    let token = req.body.token
    
    if(!token){
      sendError(res, 'Greška u autentifikaciji.', 400)
      return
    }
    
    try {
      let user = jwtVerifyUser(token)

      if(!user){
        sendError(res, 'Greška u autentifikaciji.', 400)
        return
      }

      user = await User.findOne({
        where: {
          username: user.username
        },
        include: {
          model: User,
          as: 'Friend'
        }
      })
      let friends = user.Friend

      sendResponse(res, {
        friends: friends
      })
      
    } catch(e) {
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  }

}
