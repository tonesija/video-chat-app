<template>
  <div class="home">
    <v-list dense>
        <v-list-item v-for="room in rooms" :key="room"
          router :to="'/room/' + room">
            <v-list-item-action>
                <v-icon color="white">mdi-plus</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title class="white--text caption">
                    {{ room }}
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>

    <v-text-field v-model="username"></v-text-field>
    <v-btn @click="setUsername">Set username</v-btn>
  </div>
</template>

<script>
export default {
  name: 'Home',

  data: ()=> {
    return {
      socket: null,

      rooms: [],

      username: null
    }
  },

  methods: {
    setUsername() {
      console.log('Setting username: ' + this.username)
      this.$store.commit('setUsername', this.username)
    }
  },

  created: function() {
    this.socket = this.$store.state.socket

    this.socket.on('rooms', async rooms => {
      this.rooms = rooms
    })

    this.socket.emit('get-rooms')
  },

  destroyed: function() {
    this.socket.off('rooms')
  },



  components: {
  }
}
</script>

<style scoped>

</style>