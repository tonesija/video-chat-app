import api from './api'

export default {
  async setNewProfileImg(fd){
    return api().post('/newProfileImg', fd)
  }
}