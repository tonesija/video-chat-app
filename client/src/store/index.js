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
    setUser({commit}, {creds, token}) {
      commit('setUser', creds)

      //store the token
      localStorage.setItem('token', token)

      //emit event
      this._vm.$socket.client.emit('user-logged-in', {creds})
    },
    signOut({commit}, {creds}) {
      commit('setUser', null)

      localStorage.removeItem('token')

      this._vm.$socket.client.emit('user-logged-out', {creds})
    }
  },
  modules: {
  }
})
