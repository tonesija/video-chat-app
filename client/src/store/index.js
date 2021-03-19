import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: null,
    email: null,
    isLoggedIn: false
  },
  mutations: {
    setUser(state, creds) {
      if(creds) {
        state.isLoggedIn = true
        state.username = creds.username
        state.email = creds.email
      } else {
        state.isLoggedIn = false
        state.username = null
        state.email = null
      }

    }
  },
  actions: {
    setUser({commit}, creds) {
      commit('setUser', creds)

      //TODO emit event
      //this._vm.$socket.emit('someEvent', someData)
    }
  },
  modules: {
  }
})
