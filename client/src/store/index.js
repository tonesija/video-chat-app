import Vue from 'vue'
import Vuex from 'vuex'

import router from '../router' // Vue router instance

import {COLORS} from '../util/globalVars'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id: null,
    username: null,
    email: null,
    imgPath: null,
    isLoggedIn: false,

    inPrivateCall: false,
    callee: null,
    caller: false,

    lightTheme: true
  },
  mutations: {
    setUser(state, creds) {
      if(creds) {
        state.isLoggedIn = true
        state.username = creds.username
        state.email = creds.email
        state.id = creds.id
      } else {
        state.isLoggedIn = false
        state.username = null
        state.email = null
        state.imgPath = null
        state.id = null
      }
    },

    setImgPath(state, imgPath){
      if(imgPath){
        state.imgPath = imgPath
      } else
        state.imgPath = null
    },

    setCall(state, {callee, caller}){
      if(callee){
        state.inPrivateCall = true
        state.callee = callee
      } else {
        state.inPrivateCall = false
        state.callee = null
      }
      state.caller = caller
    },

    setTheme(state, theme){
      console.log("etting theme", theme)
      state.lightTheme = theme
    }
  },
  actions: {
    setUser({commit, dispatch}, {creds, token, imgPath, Vuetify}) {
      commit('setUser', creds)
      commit('setImgPath', imgPath)

      if (creds.theme !== undefined)
        dispatch('setTheme', {
          theme: creds.theme,
          Vuetify: Vuetify 
        })

      //store the token
      localStorage.setItem('token', token)

      //emit event
      this._vm.$socket.client.emit('user-logged-in', {creds})
    },
    changeProfileImg({commit}, {newImgUrl}){
      commit('setImgPath', newImgUrl)
    },

    signOut({commit}, {creds}) {
      commit('setUser', null)

      localStorage.removeItem('token')

      this._vm.$socket.client.emit('user-logged-out', {creds})
    },

    setPrivateCall({commit}, {callee, caller}){
      commit('setCall', {callee, caller})
      
      if(callee)
        router.push('/call/'+callee)
    },

    setTheme({commit}, {Vuetify, theme}){
      commit('setTheme', theme)

      if(theme){
        Vuetify.theme.themes.light.primary = COLORS.light.primary
        Vuetify.theme.themes.light.secondary = COLORS.light.secondary
        Vuetify.theme.themes.light.accent = COLORS.light.accent
        Vuetify.theme.themes.light.background = COLORS.light.background
      } else {
        Vuetify.theme.themes.light.primary = COLORS.dark.primary
        Vuetify.theme.themes.light.secondary = COLORS.dark.secondary
        Vuetify.theme.themes.light.accent = COLORS.dark.accent
        Vuetify.theme.themes.light.background = COLORS.dark.background
      }
    }
  },
  modules: {
  }
})
