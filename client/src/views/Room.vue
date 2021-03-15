<template>
  <div class="room">
    <h1>{{$route.params.roomName}}</h1>
  </div>
</template>

<script>
export default {
  name: 'Home',

  data: ()=> {
    return {
      socket: null
    }
  },

  methods: {
  
  },

  created: function() {
    this.socket = this.$store.state.socket

    this.socket.on('user-joined-room', async user => {
      console.log('User joined room', user)
    })

    this.socket.emit('join-room', {roomName: this.$route.params.roomName, username: this.$store.state.username})

  },

  mounted: function() {

  },



  components: {
  }
}
</script>

<style scoped>

</style>