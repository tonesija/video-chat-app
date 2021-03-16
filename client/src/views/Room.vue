<template>
  <div class="room">
    <h1>{{$route.params.roomName}}</h1>

    <v-list dense>
      <v-list-item v-for="user in users" :key="user.id">
          <v-list-item-action>
              <v-icon color="white">mdi-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
              <v-list-item-title class="white--text caption">
                  {{ user.username }}
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

      users: [],

      constraints: {
        video: true,
        audio: true
      },

      videoStream: null,

      pcs: [],
      remoteVideoStreams: [],

      iceConfiguration: {
        iceServers: [
          {
            urls: ['stun:stun.l.google.com:19302']
          },
          {
              urls: [process.env.VUE_APP_ENV_TURN],
              username: process.env.VUE_APP_ENV_TURN_USERNAME,
              credential: process.env.VUE_APP_ENV_TURN_CREDENTIAL
          }
        ]
      }
    }
  },

  methods: {
    async joinCall(){
      navigator.mediaDevices.getUserMedia(this.constraints)
      .then(stream => {
          console.log('Got MediaStream:', stream)
          this.videoStream = stream;
          //add the tracks to RTCPeerConnection
          this.videoStream.getTracks().forEach(track => {
            this.pc.addTrack(track, this.videoStream)
            console.log('Adding track to peer connection!')
          })
      })
      .catch(error => {
          console.error('Error accessing media devices.', error)
      })
    }
  },

  created: function() {
    this.socket = this.$store.state.socket

    this.socket.on('user-joined-room', async user => {
      console.log('User joined room', user)
    })

    this.socket.on('user-disconnected', async user => {
      console.log('User left the room', user)
    })

    this.socket.on('room-users', async users => {
      console.log('Updated users in the room', users)
      this.users = users
    })

    this.socket.emit('join-room', {roomName: this.$route.params.roomName, username: this.$store.state.username})

  
  },

  destroyed: function() {
    this.socket.emit('leave-room', this.$route.params.roomName)
    
    this.socket.off('user-joined-room')
    this.socket.off('user-disconnected')
    this.socket.off('room-users')
  }
}
</script>

<style scoped>

</style>