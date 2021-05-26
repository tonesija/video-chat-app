const {User, Notification, Group, GroupChatMessage, GroupMember} = require('../models')

const {sendResponse, sendError} = require('../util')
const {sendGroupNotif, sendNotif, updateYourNotifs} = require('../socketio')
const {jwtVerifyUser} = require('../authentication')

function createGroupRequest(sender, group) {
  return {
    title: 'Zahtjev za grupu',
    content: `${sender} želi da se pridružite grupi ${group.name}.`,
    type: 'groupRequest',
    hasImg: true,
    imgPath: sender.imgPath,
    groupId: group.id
  }
}
function createGroup(groupName) {
  return {
    name: groupName
  }
}
async function createGroupAccept(group, sender, user) {
  let notif = {
    title: 'Zahtjev za grupu prihvaćen',
    content: `${sender.username} je prihvatio vaš zahtjev za grupu ${group.name}`,
    type: 'notification',
    hasImg: true,
    imgPath: sender.imgPath
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
  async sendGroupRequest(req, res) {
    let token = req.body.token
    let groupId = req.body.groupId
    let reciver = req.body.reciver
    console.log(reciver)

    try{
      let user = jwtVerifyUser(token)

      if(!user){
        sendError(res, 'Greška u autentifikaciji.', 400)
        return
      }
      if(user.username === reciver){
        sendError(res, 'Ne možete dodati sebe u grupu.', 400)
        return
      }
      //TODO provjeriti jeli korisnik vec u grupi
      let group = await Group.findByPk(groupId)
      let reciverUser = await User.findOne({
        where:{username: reciver}
      })
      let groupRequest = createGroupRequest(user.username, group)

      if(reciverUser){
        let notification = await Notification.create(groupRequest)
        await reciverUser.addNotification(notification)
        sendNotif(reciverUser.username)
        sendResponse(res, {
          message: `Poslali ste zahtjev korisniku ${reciver}.`
        })
      } else {
        sendError(res, 'Taj korisnik ne postoji.', 400)
      }
    }catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async acceptGroupRequest (req, res) {
    let token = req.body.token
    let groupId = req.body.groupId
    
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

      for(let notification of notifications){
        if(groupId === notification.groupId){
          let group = await Group.findByPk(groupId)
    
          if(group){
            await group.addUser(user)

            await notification.destroy()

            updateYourNotifs(user.username)
            sendGroupNotif(user.username)

            sendResponse(res, {
              message: `Pridružili ste se grupi ${group.anem}.`
            })
          } else {
            sendError(res, 'Ta grupa ne postoji.', 400)
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


  //TODO i tek onda nakon GroupMessagess
}