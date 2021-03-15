<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/video-chat">Video Chat (test)</router-link>
    </div>
    <v-main class="mx-5 mb-5 mt-2">
      <router-view></router-view>
    </v-main>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  data() {
    return {
      socket: io(process.env.VUE_APP_ENV_BASE_URL)
    }
  },

  methods: {

  },

  created: function() {
    this.$store.commit('setSocket', this.socket)
  }
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
