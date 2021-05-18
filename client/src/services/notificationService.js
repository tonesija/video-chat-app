import api from './api'

export default {
  async getNotifications(){
    let token = localStorage.getItem('token')
    return api().post('/getNotifications', {token})
  }
}