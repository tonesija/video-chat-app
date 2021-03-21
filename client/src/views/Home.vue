<template>
  <div class="home">
    <v-container>
      <v-list dense>
        <v-list-item v-for="room in rooms" :key="room"
          router :to="'/room/' + room">
            <v-list-item-action>
                <v-icon color="">mdi-plus</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title class=" caption">
                    {{ room }}
                </v-list-item-title>
            </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
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

  },
  
  sockets: {
    rooms: function(rooms) {
      console.log('rooms: ', rooms)
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