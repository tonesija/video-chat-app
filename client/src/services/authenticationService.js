import api from './api'

export default {
  async register(creds){
    return api().post('/register', creds)
  },

  async login(creds){
    return api().post('/login', creds)
  }
}