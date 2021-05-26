const {User, Notification, Group, GroupChatMessage, GroupMember} = require('../models')

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
function createGroup(groupName) {
  return {
    name: groupName
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

function printMethods(obj) {
  for (var id in obj) {
    try {
      if (typeof(obj[id]) == "function") {
        console.log(id + ": " + obj[id].toString());
      }
    } catch (err) {
      console.log(id + ": inaccessible");
    }
  }
  console.log()
}

module.exports = {
  async createGroup(req, res) {
    let token = req.body.token
    let groupName = req.body.groupName

    try{
      let user = jwtVerifyUser(token)

      if(!user){
        sendError(res, 'Greška u autentifikaciji.', 400)
        return
      }

      let newGroup = createGroup(groupName)
      newGroup = await Group.create(newGroup)
      user = await User.findOne({where: {username: user.username}})
      await user.addGroup(newGroup)
      await newGroup.addUser(user)
      printMethods(newGroup)
      printMethods(user)

      sendResponse(res, {
        group: newGroup
      })
    }catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async deleteGroup(req, res) {
    let token = req.body.token
    let groupName = req.body.groupName

    try{
      let user = jwtVerifyUser(token)

      if(!user){
        sendError(res, 'Greška u autentifikaciji.', 400)
        return
      }

      user = await User.findOne({where: {username: user.username}})
      let group = await Group.findOne({where: {
        creatorId: user.id,
        name: groupName
      }})
      if(!group){
        sendError(res, "Grupa ne postoji.")
        return
      }
        
      await group.destroy()

      sendResponse(res, {
        message: "Grupa uspješno izbrisasna."
      })
    }catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async getGroups(req, res) {
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
          model: Group,
          as: 'Groups'
        }
      })
      let groups = user.Groups
        
      sendResponse(res, {
        groups: groups
      })
    }catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async getGroupMembers(req, res) {
    let token = req.body.token
    let groupId = req.body.groupId

    try{
      let user = jwtVerifyUser(token)

      if(!user){
        sendError(res, 'Greška u autentifikaciji.', 400)
        return
      }

      let group = await Group.findByPk(groupId)
      let members = await group.getUsers()
        
      sendResponse(res, {
        members: members
      })
    }catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },

  //TODO groupe invite (notification)
  //TODO accept group invite
  //TODO ovo gori sa socketima
  //TODO i tek onda nakon GroupMessagess
}