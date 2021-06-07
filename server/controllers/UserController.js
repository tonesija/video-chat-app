const {User} = require('../models')

const {sendResponse, sendError, formatUser, printMethods} = require('../util')
const {jwtSingUser} = require('../authentication')

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
        let dbUser = await User.create(creds)
        dbUser.imgPath = 'default-profile.png'
        dbUser.theme = true
        await dbUser.save()

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
      let user = req.body.authenticatedUser
      console.log(user)
      sendResponse(res, {
        user: formatUser(user),
        token: token
      })
    } catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async getFriends (req, res) {
    try {
      let user = req.body.authenticatedUser
      if(!user){
        sendError(res, 'Greška u autentifikaciji.', 400)
        return
      }
      let friends = await user.getFriend()

      sendResponse(res, {
        friends: friends
      })
    } catch(e) {
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },

  async getUser(req, res) {
    try {
      let username = req.body.username
      let user = await User.findOne({where: {
        username: username
      }})

      if(user){
        sendResponse(res, {
          user: formatUser(user)
        })
      } else {
        sendError(res, 'Taj korisnik ne postoji')
      }
    } catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },

  async setTheme(req, res) {
    let theme = req.body.theme
    try {
      let user = req.body.authenticatedUser

      user.theme = theme
      await user.save()

      sendResponse(res, {
        message: 'Uspješno postavljena nova tema'
      })
    } catch(e) {
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },

  async setNewProfileImg(req, res) {
    try {
      let user = req.body.authenticatedUser

      //postavi mu put
      let imgName = req.files['img'][0].filename
      user.imgPath = `profile-images/${imgName}`
      await user.save()

      sendResponse(res, {
        message: 'Profilna slika uspješno postavljena',
        path: user.imgPath
      })
    } catch(e) {
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },

  async getImgByUsername(){
    let username = req.params.username
    console.log(username)
    try {
      let user = await User.findOne({
        where:{
          username: username
        }
      })
      res.sendFile(user.imgPath)
    } catch(e){
      console.log(e)
      sendError(res, 'Ta slika ne postoji', 404)
    }
  }
}
