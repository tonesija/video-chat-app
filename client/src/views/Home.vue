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
  
  sockets: {
    rooms: function(rooms) {
      this.rooms = rooms
    }
  },

  created: function() {
    this.$socket.client.emit('get-rooms')
  },

  destroyed: function() {
  },



  components: {
  }
}
</script>

<style scoped>

</style>