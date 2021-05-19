const {User, Notification} = require('../models')

const {sendResponse, sendError} = require('../util')
const {sendFriendNotif, sendNotif, updateYourNotifs} = require('../socketio')
const {jwtVerifyUser} = require('../authentication')

function createFriendRequest(sender) {
  return {
    title: 'Zahtjev za prijateljstvo',
    content: `${sender.username} vam šalje zahtjev za prijateljstvo`,
    type: 'request',
    hasImg: true,
    imgPath: sender.imgPath,
    otherUserUsername: sender.username
  }
}
async function createFriendAccept(user, sender) {
  let notif = {
    title: 'Zahtjev prihvaćen',
    content: `${sender.username} je prihvatio vaš zahtjev`,
    type: 'notification',
    hasImg: true,
    imgPath: sender.imgPath,
    otherUserUsername: sender.username
  }
  let notifBase = await Notification.create(notif)
  await user.addNotification(notifBase)
}

module.exports = {
  async readNotification(req, res) {
    let token = req.body.token
    let notifID = req.body.notifID

    try{
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
          model: Notification,
          as: 'Notifications',
          where:{
            id: notifID
          }
        }
      })
      let notifications = user.Notifications
      if(notifications.length != 1){
        sendError(res, 'Neočekivana greška', 500)
        return
      }
      
      notification[0].read = true
      await notification[0].save()

      sendResponse(res, {
        message: "Uspjeh."
      })
    }catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async removeNotifcation(req, res) {
    let token = req.body.token
    let notifID = req.body.notifID

    console.log(notifID)

    try{
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
          model: Notification,
          as: 'Notifications',
          where:{
            id: notifID
          }
        }
      })
      let notifications = user.Notifications
      console.log(notifications)
      if(notifications.length != 1){
        sendError(res, 'Neočekivana greška', 500)
        return
      }
      
      await notifications[0].destroy()

      sendResponse(res, {
        message: "Uspjeh."
      })
    }catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },


  async getNotifications(req, res) {
    let token = req.body.token

    try{
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
          model: Notification,
          as: 'Notifications'
        }
      })
      let notifications = user.Notifications

      sendResponse(res, {
        notifications: notifications
      })
    }catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async sendFriendRequest(req, res) {
    let token = req.body.token
    let otherUsername = req.body.otherUsername

    try{
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
      console.log(user)

      if(otherUser){
        let notification = await Notification.create(createFriendRequest(user))
        await otherUser.addNotification(notification)
        sendNotif(otherUser.username)
        sendResponse(res, {
          message: `Poslali ste zahtjev korisniku ${otherUsername}.`
        })
      } else {
        sendError(res, 'Taj korisnik ne postoji.', 400)
      }
    }catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async acceptFriendRequest (req, res) {
    let token = req.body.token
    let otherUsername = req.body.otherUsername
    
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
          model: Notification,
          as: 'Notifications'
        }
      })
      let notifications = user.Notifications
      console.log(notifications)
      for(let notification of notifications){
        if(otherUsername === notification.otherUserUsername){
          let otherUser = await User.findOne({
            where: {
              username: otherUsername
            }
          })
    
          if(otherUser){
            await user.addFriend(otherUser)
            await otherUser.addFriend(user)
            await notification.destroy()

            await createFriendAccept(otherUser, user)
            sendFriendNotif(user.username)
            sendFriendNotif(otherUsername)
            updateYourNotifs(user.username)
            sendNotif(otherUsername)

            sendResponse(res, {
              message: `${otherUsername} je sada vaš prijatelj.`
            })
          } else {
            sendError(res, 'Taj korisnik ne postoji.', 400)
          }
          break
        }
      }
      sendError(res, 'Neočekivana greška', 500)
    } catch(e) {
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async addFriend (req, res) {
    let token = req.body.token
    let otherUsername = req.body.otherUsername
    
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

        sendFriendNotif(otherUsername)
      } else {
        sendError(res, 'Taj korisnik ne postoji.', 400)
      }
      
    } catch(e) {
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  }

}