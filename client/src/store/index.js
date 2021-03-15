import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket: null,
    username: null
  },
  mutations: {
    setUsername(state, username) {
      state.username = username
    },

    setSocket(state, socket) {
      state.socket = socket
    }
  },
  actions: {
    setUsername({commit}, username) {
      commit('setUsername', username)
    },

    setSocket({commit}, socket) {
      commit('setSocket', socket)
    }
  },
  modules: {
  }
})
