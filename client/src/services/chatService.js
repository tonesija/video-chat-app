import api from './api'

export default {
  async sendMsg(payload){
    return api().post('/sendMessage', payload)
  },
  async getMessages(payload){
    return api().post('/getMessages', payload)
  }
}