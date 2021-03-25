import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#c8d6e5',
        secondary: '#222f3e',
        accent: '#ff9f43'
      },
      dark: {
        primary: '#111111'
      }
    }
  }
})
