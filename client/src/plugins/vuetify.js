import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import {COLORS} from '../util/globalVars'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: COLORS.light.primary,
        secondary: COLORS.light.secondary,
        accent: COLORS.light.accent,
        online: COLORS.online,
        offline: COLORS.offline,
        background: COLORS.light.background
      },
      dark: {
        primary: COLORS.dark.primary,
        secondary: COLORS.dark.secondary,
        accent: COLORS.dark.accent
      }
      
    }
  }
})
