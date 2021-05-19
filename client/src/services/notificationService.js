import api from './api'

export default {
  async getNotifications(){
    let token = localStorage.getItem('token')
    return api().post('/getNotifications', {token})
  },
  async acceptFriend(otherUsername){
    let token = localStorage.getItem('token')
    return api().post('/acceptFriendRequest', 
      {token: token, otherUsername: otherUsername})
  },
  async readNotification(id){
    let token = localStorage.getItem('token')
    return api().post('/readNotification', {token: token, notifID: id})
  },
  async removeNotification(id){
    let token = localStorage.getItem('token')
    return api().post('/removeNotification', {token: token, notifID: id})
  }
}