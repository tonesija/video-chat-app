<template>
  <div class="home">
    <v-list dense>
        <v-list-item v-for="room in rooms" :key="room.name"
          router :to="'/room/' + room.name">
            <v-list-item-action>
                <v-icon color="white">mdi-plus</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title class="white--text caption">
                    {{ room.name }}
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list> 
  </div>
</template>

<script>
export default {
  name: 'Home',

  data: ()=> {
    return {
      socket: null,

      rooms: []
    }
  },

  methods: {
  
  },

  created: function() {
    this.socket = this.$store.state.socket

    this.socket.on('rooms', async rooms => {
      this.rooms = rooms
    })

    this.socket.emit('get-rooms')
  },

  mounted: function() {

  },



  components: {
  }
}
</script>

<style scoped>

</style>