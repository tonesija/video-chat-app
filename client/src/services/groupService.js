import api from './api'

export default {
  async getGroups(){
    let token = localStorage.getItem('token')
    return api().post('/getGroups', {token})
  },
  async getGroup(groupName){
    let token = localStorage.getItem('token')
    return api().post('/getGroup', {token, groupName})
  },
  async createGroup(groupName){
    let token = localStorage.getItem('token')
    return api().post('/createGroup', {token, groupName})
  },
  async deleteGroup(groupName){
    let token = localStorage.getItem('token')
    return api().post('/deleteGroup', {token, groupName})
  },
  async leaveGroup(groupId){
    let token = localStorage.getItem('token')
    return api().post('/leaveGroup', {token, groupId})
  },
  async removeMember(groupId, member){
    let token = localStorage.getItem('token')
    return api().post('/removeMember', {token, groupId, member})
  },
  async getGroupMembers(groupId){
    let token = localStorage.getItem('token')
    return api().post('/getGroupMembers', {token, groupId})
  },
  async sendGroupRequest(groupId, reciver){
    let token = localStorage.getItem('token')
    return api().post('/sendGroupRequest', {token, groupId, reciver})
  },
  async acceptGroupRequest(groupId){
    let token = localStorage.getItem('token')
    return api().post('/acceptGroupRequest', {token, groupId})
  },
  async setNewProfileImg(fd){
    return api().post('/sendGroupRequest', fd)
  },
}