const jwt = require('jsonwebtoken')
const config = require('../config')

const {User} = require('../models')

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

//middleware za autentifikaciju
//postavlja body.authenticatedUser ili vraca
//400 -> Greška u autentifikaciji.
async function authentication(req, res, next){
  let token = req.body.token

  try{
    let user = jwtVerifyUser(token)

    if(!user){
      sendError(res, 'Greška u autentifikaciji.', 400)
      return
    }

    user = await User.findOne({where: {
      username: user.username
    }})

    req.body.authenticatedUser = user
    console.log('Postvaljen autentificiran korisnik:', user)

    next()
  }catch(e){
    console.log(e)
    sendError(res, 'Neočekivana greška', 500)
  }

}

module.exports = {
  jwtSingUser,
  jwtVerifyUser,
  authentication
}