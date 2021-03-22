import api from './api'

export default {
  async addFriend(payload){
    return api().post('/addFriend', payload)
  }
}