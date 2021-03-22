const {User, ChatMessage} = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config')

const { Op } = require("sequelize");

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



module.exports = {
  async sendMessage (req, res) {
    //pl treba sadrzavati: content, senderToken, reciverUsername
    let pl = req.body
    console.log(pl)
    if(!pl.content || !pl.senderToken || !pl.reciverUsername){
      sendError(res, 'Greška kod formata zahtjeva.', 400)
      return
    }

    try {
      let sender
      try{
        sender = jwtVerifyUser(pl.senderToken)
      }catch(e){
        sendError(res, 'Neautorizirani korisnik.', 400)
        return
      }
      
      try {
        console.log(sender)
        sender = await User.findOne({
          where: {
            username: sender.username
          }
        })
        let reciver = await User.findOne({
          where: {
            username: pl.reciverUsername
          }
        })

        if(!sender){
          sendError(res, 'Neočekivana greška.', 500)
          return
        }
        if(!reciver){
          sendError(res, 'Primatelj ne postoji.', 400)
          return
        }

        //TODO: provjeri jesu li prijatelji

        //stvaranje poruke u bazi
        console.log('Poruka se sprema u bazu.')
        let newMsg = await ChatMessage.create({
          content: pl.content,
          user1Id: sender.id,
          user2Id: reciver.id
        })
        
        sendResponse(res, {
          message: 'Poruka uspješno poslana.',
          chatMessage: newMsg
        })
      } catch (e) {
        sendError(res, 'Neočekivana greška.', 500)
      }
    } catch (e) {
      sendError(res, 'Neočekivana greška.', 500)
    }
  },

  async getMessages(req, res){
    //pl sadrzi token, otherUsername
    let pl = req.body

    if(!pl.token || !pl.otherUsername){
      sendError(res, 'Greška kod formata zahtjeva.', 400)
      return
    }

    try {
      let sender
      try{
        sender = jwtVerifyUser(pl.token)
      }catch(e){
        sendError(res, 'Neautorizirani korisnik.', 400)
        return
      }
      
      try {
        sender = await User.findOne({
          where: {
            username: sender.username
          }
        })
        let reciver = await User.findOne({
          where: {
            username: pl.otherUsername
          }
        })

        if(!sender){
          sendError(res, 'Neočekivana greška.', 500)
          return
        }
        if(!reciver){
          sendError(res, 'Primatelj ne postoji.', 400)
          return
        }

        //TODO: provjeri jesu li prijatelji

        console.log('Dohvaćanje poruka iz baze')
        let msgs = await ChatMessage.findAll({
          where: {
            user1Id: {
              [Op.or]: [sender.id, reciver.id]
            },
            user2Id: {
              [Op.or]: [sender.id, reciver.id]
            }
          },
          include: [{
            model: User,
            as: 'user1'
          }]
        })
        
        sendResponse(res, {
          message: 'Poruke uspješno dohvaćene.',
          chatMessages: msgs
        })
      } catch (e) {
        console.log(e)
        sendError(res, 'Neočekivana greška.', 500)
      }
    } catch (e) {
      sendError(res, 'Neočekivana greška.', 500)
    }
  }
}
