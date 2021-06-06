<template>
  <div class="room">
    <h1>{{$route.params.groupId}}</h1>

    <video :srcObject.prop="videoStream" autoplay 
    playsinline controls="false"></video>

    <div>
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
  data: ()=> {
    return {
      localUsername: null,
      groupId: null,
      users: [],
      pcs: null,

      constraints: {
        video: true,
        audio: true
      },

      videoStream: null,

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

      this.$socket.client.emit('user-joined-call', 
        {username: this.localUsername, groupId: this.$route.params.groupId})

      //onMessageIceCandidate
      this.$socket.$subscribe('messageGroup', async (message) => {
        if (message.candidate && message.reciver === this.localUsername) {
          try {
            console.log('Addin ice candidate to peer connection, sender: '+message.sender+', reciver: '+message.reciver)
            await this.pcs.get(message.sender).addIceCandidate(message.candidate);
          } catch (e) {
            console.error('Error adding received ice candidate', e);
          }
        }
      })
      
      //--- on answer ---
      this.$socket.$subscribe('messageGroup', async (message) => {
        if (message.answer && message.reciver === this.localUsername) {
          console.log('Got an answer from ', message.sender)
          const remoteDesc = new RTCSessionDescription(message.answer)
          //quick fix before upgrading the signaling (correct users get correct signals) 
          if(!this.pcs.get(message.sender).currentRemoteDescription)
            await this.pcs.get(message.sender).setRemoteDescription(remoteDesc)
        }
      })

      //--- on offer ---
      this.$socket.$subscribe('messageGroup', async (message) => {
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
    userJoinedCall: async function(username) {
      console.log('userJoinedCall:',username)
      let pc = new RTCPeerConnection(this.iceConfiguration)
      RTCService.setLocalStream(pc, this.videoStream)
      this.pcs.set(username, pc)

      RTCService.myOnTrack(username, pc, this.remoteVideoStreams)

      RTCService.setupNewPc(pc, this.localUsername, username, this.$socket.client)
      
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
      this.$socket.client.emit('offer-group', 
        {offer: offer, sender: this.localUsername, reciver: username,
        groupId: this.groupId})
    }
  },

  created: function() {
    this.localUsername = this.$store.state.username
    this.groupId = this.$route.params.groupId

    //ask for camera and mic access
    navigator.mediaDevices.getUserMedia(this.constraints)
    .then(stream => {
        this.videoStream = stream
    })
    .catch(error => {
        console.error('Error accessing media devices.', error)
    })

    this.joinCall()
  }
}
</script>