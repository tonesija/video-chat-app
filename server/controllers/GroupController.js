const {User, Notification, Group, GroupChatMessage, GroupMembers} = require('../models')

const {sendResponse, sendError, printMethods} = require('../util')
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

//TODO popravi ovo pls
async function getGroups(user) {
  let groups = await GroupMembers.findAll({
    where: {
      UserId: user.id
    }
  })
  toReturn = []
  for(i of groups){
    toReturn.push(await Group.findByPk(i.GroupId))
  }
  return toReturn
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

      let groups = await getGroups(user)
      console.log(groups)
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
              message: `Pridružili ste se grupi ${group.name}.`
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