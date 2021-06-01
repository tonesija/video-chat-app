const {User, Notification, Group, GroupChatMessage, GroupMembers} = require('../models')

const {sendResponse, sendError, printMethods} = require('../util')
const {sendGroupNotif, sendNotif, updateYourNotifs} = require('../socketio')

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
    let groupName = req.body.groupName
    try{
      let user = req.body.authenticatedUser

      let newGroup = createGroup(groupName)
      newGroup = await Group.create(newGroup)
      await user.addGroup(newGroup)
      await newGroup.addUser(user)

      sendResponse(res, {
        group: newGroup
      })
    }catch(e){
      console.log(e)
      sendError(res, 'Grupa s tim imenom već postoji.', 400)
    }
  },
  async deleteGroup(req, res) {
    let groupName = req.body.groupName
    try{
      let user = req.body.authenticatedUser

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
    try{
      let user = req.body.authenticatedUser

      let groups = await getGroups(user)
      sendResponse(res, {
        groups: groups
      })
    }catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async getGroup(req, res) {
    let groupName = req.body.groupName
    try{
      let user = req.body.authenticatedUser

      let group = await Group.findOne({
        where: {
          name: groupName
        }
      })
      if(!group){
        sendError(res, "Ta grupa ne postoji.", 400)
        return
      }
      let members = await group.getUsers()
      console.log(members)
      for(let member of members){
        if(member.id === user.id){
          sendResponse(res, {
            group: group
          })
          return
        }
      }

      sendError(res, "Niste član te grupe.", 400)
    }catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async getGroupMembers(req, res) {
    let groupId = req.body.groupId
    try{
      let user = req.body.authenticatedUser

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
    let groupId = req.body.groupId
    let reciver = req.body.reciver
    try{
      let user = req.body.authenticatedUser

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
    let groupId = req.body.groupId
    try {
      let user = req.body.authenticatedUser

      let notifications = await user.getNotifications()

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