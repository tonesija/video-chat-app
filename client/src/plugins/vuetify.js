import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#98D2EB',
        secondary: '#B2B1CF'
      },
      dark: {
        primary: '#111111'
      }
    }
  }
})
