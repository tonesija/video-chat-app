<template>
  <div class="room">
    <h1>{{$route.params.roomName}}</h1>

    <v-btn @click="joinCall">Join call</v-btn>

    <video v-if="inCall" :srcObject.prop="videoStream" autoplay 
    playsinline controls="false"></video>

    <div v-if="inCall">
      <video  v-for="remoteVideoStream in remoteVideoStreams"
        :key="remoteVideoStream.username"
        :srcObject.prop="remoteVideoStream.mediaStream" autoplay 
        playsinline controls="false">
      </video>
    </div>
    

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
import RTCService from '../util/RTCService'
export default {
  name: 'Room',

  data: ()=> {
    return {
      localUsername: null,
      users: [],
      pcs: null,

      room: null,

      constraints: {
        video: true,
        audio: true
      },

      videoStream: null,
      inCall: false,

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
      //create pcs map
      this.pcs = new Map()
      this.inCall = true

      this.$socket.client.emit('user-joined-call', {username: this.localUsername})

      //onMessageIceCandidate
      this.$socket.$subscribe('message', async ({message}) => {
        if (message.iceCandidate && message.reciver === this.localUsername) {
          try {
            console.log('Addin ice candidate to peer connection, sender: '+message.sender+', reciver: '+message.reciver)
            await this.pcs.get(message.sender).addIceCandidate(message.iceCandidate);
          } catch (e) {
            console.error('Error adding received ice candidate', e);
          }
        }
      })
      
      //--- on answer ---
      this.$socket.$subscribe('message', async ({message}) => {
        if (message.answer && message.reciver === this.localUsername) {
          console.log('Got an answer from ', message.sender)
          const remoteDesc = new RTCSessionDescription(message.answer)
          //quick fix before upgrading the signaling (correct users get correct signals) 
          if(!this.pcs.get(message.sender).currentRemoteDescription)
            await this.pcs.get(message.sender).setRemoteDescription(remoteDesc)
        }
      })



      //--- on offer ---
      this.$socket.$subscribe('message', async ({message}) => {
        if(message.offer && message.reciver === this.localUsername){
          console.log('Got an offer from', message.sender)
          let pc = new RTCPeerConnection(this.iceConfiguration)
          this.pcs.set(message.sender, pc)

          RTCService.setLocalStream(pc, this.videoStream)
          RTCService.myOnTrack(message.sender, pc, this.remoteVideoStreams)
          RTCService.setupNewPc(pc, this.localUsername, message.sender, this.$socket.client)

          
          
          RTCService.myOnConnChange(pc)

          await pc.setRemoteDescription(new RTCSessionDescription(message.offer))

          const answer = await pc.createAnswer()

          await pc.setLocalDescription(answer)
          this.$socket.client.emit('answer', {answer: answer,
            sender: this.localUsername, reciver: message.sender})
        }
      })
      
    }
  },

  sockets: {
    userJoinedRoom: function(user) {
      console.log('User joined room', user)
    },
    userDisconnected: function(user) {
      console.log('User left the room', user)
    },
    roomUsers: function(users) {
      console.log('Updated users in the room', users)
      this.users = users
    },
    userJoinedCall: async function(user) {
      if(!this.inCall) return
      let pc = new RTCPeerConnection(this.iceConfiguration)
      RTCService.setLocalStream(pc, this.videoStream)
      this.pcs.set(user.username, pc)

      RTCService.myOnTrack(user.username, pc, this.remoteVideoStreams)

      RTCService.setupNewPc(pc, this.localUsername, user.username, this.$socket.client)
      
      RTCService.myOnConnChange(pc)

      //create offer
      var mediaConstraints = {
        'offerToReceiveAudio': true,
        'offerToReceiveVideo': true    
      }
      console.log('Creating offer')
      const offer = await pc.createOffer(mediaConstraints)
      
      //set local and remote descriptions
      await pc.setLocalDescription(offer)
      this.$socket.client.emit('offer', {offer: offer, sender: this.localUsername, reciver: user.username})
    }
  },

  created: function() {
    this.room = this.$route.params.roomName
    this.localUsername = this.$store.state.username

    //ask for camera and mic access
    navigator.mediaDevices.getUserMedia(this.constraints)
    .then(stream => {
        this.videoStream = stream
    })
    .catch(error => {
        console.error('Error accessing media devices.', error)
    })

    this.$socket.client.emit('join-room', {roomName: this.room, username: this.$store.state.username})
  },

  beforeDestroy: function() {
    console.log('Destroy room', this.room)
    this.$socket.client.emit('leave-room', this.room)
  }
}
</script>

<style scoped>

</style>