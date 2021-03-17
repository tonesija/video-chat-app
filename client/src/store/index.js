import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: null
  },
  mutations: {
    setUsername(state, username) {
      state.username = username
    }
  },
  actions: {
    setUsername({commit}, username) {
      commit('setUsername', username)
    }
  },
  modules: {
  }
})
