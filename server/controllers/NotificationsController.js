const {User, Notification} = require('../models')

const {sendResponse, sendError, printMethods} = require('../util')
const {sendFriendNotif, sendNotif, updateYourNotifs} = require('../socketio')

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
    let notifID = req.body.notifID
    try{
      let user = req.body.authenticatedUser
      
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
      let notifications = await user.getNotifications()
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
    let notifID = req.body.notifID
    try{
      let user = req.body.authenticatedUser
      
      let notifications = await user.getNotifications({
        where:{
          id: notifID
        }
      })
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
    try{
      let user = req.body.authenticatedUser
      
      let notifications = await user.getNotifications()

      sendResponse(res, {
        notifications: notifications
      })
    }catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async sendFriendRequest(req, res) {
    let otherUsername = req.body.otherUsername
    try{
      let user = req.body.authenticatedUser

      if(user.username === otherUsername){
        sendError(res, 'Ne možete dodati sebe za prijatelja.', 400)
        return
      }
      
      let friends = await user.getFriend()
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
    let otherUsername = req.body.otherUsername
    try {
      let user = req.body.authenticatedUser

      let notifications = await user.getNotifications()
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
  }
}