import api from './api'

export default {
  async addFriend(payload){
    return api().post('/addFriend', payload)
  },
  async getFriends(payload){
    return api().post('/getFriends', payload)
  },
  async getUser(payload){
    return api().post('getUser', payload)
  },
  async sendFriendRequest(otherUsername){
    let token = localStorage.getItem('token')
    return api().post('/sendFriendRequest', 
      {token: token, otherUsername: otherUsername})
  }
}