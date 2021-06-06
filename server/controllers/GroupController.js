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

//----- POMOĆNE METODE -----
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
      newGroup.imgPath = 'default-profile-group.png'
      await user.addGroup(newGroup)
      await newGroup.addUser(user)
      await newGroup.save()

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
  async removeMember(req, res) {
    let groupId = req.body.groupId
    let member = req.body.member
    try{
      let user = req.body.authenticatedUser

      let group = await Group.findByPk(groupId)
      if(user.id != group.creatorId){
        sendError(res, 'Niste vlasnik grupe.', 400)
        return
      }
      let members = await group.getUsers()
      for(let m of members){
        if(m.username == member){
          await group.removeUser(m)
          sendResponse(res, {
            message: 'Korisnik je izbačen iz grupe.'
          })
          return
        }
      }
      sendError(res, 'Taj korisnik nije u grupi.', 400)
    }catch(e){
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async leaveGroup(req, res) {
    let groupId = req.body.groupId
    try{
      let user = req.body.authenticatedUser

      let group = await Group.findByPk(groupId)
      if(user.id == group.creatorId){
        await group.destroy()
      } else {
        await group.removeUser(user)
      }
        
      sendResponse(res, {
        message: 'Napustili ste grupu.'
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
              message: `Pridružili ste se grupi ${group.name}.`,
              group: group
            })
          } else {
            sendError(res, 'Ta grupa ne postoji.', 400)
          }
          return
        }
      }
      sendError(res, 'Neočekivana greška', 500)
    } catch(e) {
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async setNewProfileImg(req, res) {
    let groupId = req.body.groupId
    try {
      let imgName = req.files['img'][0].filename
      let group = await Group.findByPk(groupId)    
      group.imgPath = `profile-images/${imgName}`
      await group.save()

      sendResponse(res, {
        message: 'Profilna slika uspješno postavljena',
        path: group.imgPath
      })
    } catch(e) {
      console.log(e)
      sendError(res, 'Neočekivana greška', 500)
    }
  },
  async sendMessage (req, res) {
    let groupId = req.body.groupId
    let content = req.body.content
    let sender = req.body.authenticatedUser
    try {
      let group = await Group.findByPk(groupId)
      if(!group){
        sendError(res, 'Grupa ne postoji.', 400)
        return
      }

      if(!await group.hasUser(sender)){
        sendError(res, 'Niste član grupe.', 400)
        return
      }

      let newMsg = await GroupChatMessage.create({
        content: content,
        GroupId: groupId,
        UserId: sender.id
      })
      
      sendResponse(res, {
        message: 'Poruka uspješno poslana.',
        chatMessage: newMsg
      })
    } catch (e) {
      sendError(res, 'Neočekivana greška.', 500)
    }
  },
  async getMessages(req, res){
    let user = req.body.authenticatedUser
    let groupId = req.body.groupId
      try {
        let group = await Group.findByPk(groupId)
        if(!group){
          sendError(res, 'Grupa ne postoji.', 400)
          return
        }
        if(!await group.hasUser(user)){
          sendError(res, 'Niste član grupe.', 400)
          return
        }

        let msgs = await group.getGroupChatMessages({
          include:{
            model: User,
            as: 'User'
          }
        })
        
        sendResponse(res, {
          message: 'Poruke uspješno dohvaćene.',
          chatMessages: msgs
        })
      } catch (e) {
        console.log(e)
        sendError(res, 'Neočekivana greška.', 500)
      }
  }
}