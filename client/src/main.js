import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueSocketIOExt from 'vue-socket.io-extended'
import { io } from 'socket.io-client'

const socket = io(process.env.VUE_APP_ENV_BASE_URL);
Vue.use(VueSocketIOExt, socket, { store })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
