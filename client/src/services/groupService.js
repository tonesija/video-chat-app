import api from './api'

export default {
  async getGroups(){
    let token = localStorage.getItem('token')
    return api().post('/getGroups', {token})
  },
}