<template>
  <v-container class="Call height100">
    <v-row align="center" justify="center">
      <v-menu offset-y :close-on-content-click="false"
      rounded="lg" bottom>
        <template v-slot:activator="{ on, attrs }">
          <video :srcObject.prop="remoteVideoStream" autoplay 
          playsinline :controls="false"
          width="640" height="480"
          v-bind="{attrs: attrs}"
          v-on="on" :volume="0.0" ref="otherVideo"
          >
          </video>
        </template>
        <v-layout row justify-center class="primary lighten-3 px-2 pb-0 ma-0">
          <v-flex class="pa-0 ma-0">
            <p class="subtitle mb-0">{{ otherUser }}</p>
            <v-slider v-model="volume" @change="changeVolume"
            dense>
            </v-slider>
          </v-flex>
        </v-layout>
      </v-menu>
    </v-row>
    <v-btn @click="turnOnCamera">Turn camera on</v-btn>

    <v-row align="center" justify="center">
      <v-menu offset-y :close-on-content-click="false"
      rounded="lg" bottom>
      <template v-slot:activator="{ on, attrs }">
          <video :srcObject.prop="videoStream" autoplay 
          playsinline  muted :controls="false"
          width="300" height="260"
          v-bind="{attrs: attrs}"
          v-on="on"
          >
          </video>
      </template>
        <v-container class="primary lighten-3">
          <p class="subtitle">{{ $store.state.username }}</p>
        </v-container>
      </v-menu>
    </v-row>

    <v-row align="end" justify="center">
      <v-btn icon x-large @click="hangUp(true)">
        <v-icon x-large color="error">mdi-phone-hangup</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import RTCService from '../util/RTCService'

export default {
  name: 'Call',

  data: ()=> {
    return {
      constraints: {
        video: true,
        audio: true
      },

      videoStream: null,
      remoteVideoStream: null,

      
      iceCandidates: [],
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
      },
      pc: null,
      isOtherPcSetUp: false,
      pcSetUp: false,

      otherUser: null,
      volume: 50
    }
  },

  sockets: {
    message: async function(message) {
      if (message.offer) {
        console.log('Got an offer')
        this.pc.setRemoteDescription(new RTCSessionDescription(message.offer));
        const answer = await this.pc.createAnswer();
        
        await this.pc.setLocalDescription(answer)
        this.$socket.client.emit('answer', {answer: answer, reciver: this.otherUser})
      } else if (message.candidate) {
        console.log('Got and ice candidate through message')
        try {
        console.log('Addin ice candidate to peer connection')
        await this.pc.addIceCandidate(message.candidate);
        } catch (e) {
        console.error('Error adding received ice candidate', e);
        }
      }
    },
    otherPcSetUp: async function() {
      this.isOtherPcSetUp = true
      if(this.pcSetUp && this.$store.state.caller)
        this.makeCall()
    },
    otherUserHangedUp: async function() {
      this.hangUp(false)
    }
  },

  computed: {
    volumeAdj: function(){
      return this.volume/100
    }
  },

  methods: {
    async makeCall() {
      //RTCServickeCall(this.pc, this.socket)
      console.log('Making call')
      this.$socket.client.on('message', async message => {
        if (message.answer) {
          console.log('Got an answer')
          const remoteDesc = new RTCSessionDescription(message.answer)
          await this.pc.setRemoteDescription(remoteDesc)
        }
      })
      var mediaConstraints = {
      'offerToReceiveAudio': true,
      'offerToReceiveVideo': true    
      }

      const offer = await this.pc.createOffer(mediaConstraints)
      await this.pc.setLocalDescription(offer)
      this.$socket.client.emit('offer', {offer: offer, reciver: this.otherUser})
    },

    setupPc(){
      // Listen for local ICE candidates on the local RTCPeerConnection
      RTCService.onIceCandidate(this.pc, this.$socket.client, this.otherUser)

      // Listen for connectionstatechange on the local RTCPeerConnection
      RTCService.oneIceConnectionChange(this.pc)

      //get the remote stream
      this.remoteVideoStream = new MediaStream()
      RTCService.onTrack(this.pc, this.remoteVideoStream)

      this.pcSetUp = true
      this.$socket.client.emit('pc-setup', {reciver: this.otherUser})

      if(this.$store.state.caller && this.isOtherPcSetUp){
        //setTimeout(() => {
          this.makeCall()
        //}, 1200)
      }
    },

    turnOnCamera(){
      RTCService.onNegotiationNeeded(this.pc, this.otherUser, this.$socket.client)
      navigator.mediaDevices.getUserMedia({video:true})
      .then(stream => {
          console.log('Got MediaStream:', stream)
          //this.videoStream = stream
          //add the tracks to RTCPeerConnection
          stream.getTracks().forEach(track => {
            this.videoStream.addTrack(track)
            this.pc.addTrack(track, this.videoStream)
            console.log('Adding track to peer connection!')
          })
      })
    },

    changeVolume(){
      this.$refs['otherVideo'].volume = this.volumeAdj
    },

    hangUp(first){
      if(first)
        this.$socket.client.emit('hang-up', {reciver: this.otherUser})
      this.$router.push('/chat/'+this.otherUser)
    }

  },

  

  created: function() {
    this.otherUser = this.$route.params.username

    this.pc = new RTCPeerConnection(this.iceConfiguration)

    navigator.mediaDevices.getUserMedia({audio:true})
    .then(stream => {
        console.log('Got MediaStream:', stream)
        this.videoStream = stream
        //add the tracks to RTCPeerConnection
        this.videoStream.getTracks().forEach(track => {
          this.pc.addTrack(track, this.videoStream)
          console.log('Adding track to peer connection!')
        })

        this.setupPc()
    })
    .catch(error => {
        console.error('Error accessing media devices.', error)
    })
  },

  destroyed: function() {
    //update vuex private call state
    this.$store.dispatch('setPrivateCall', {callee: null})

    this.$socket.client.off('message')

    //turn off mic and camera
    this.videoStream.getTracks().forEach(track => {
      track.stop()
    })
  },

  components: {
  }
}
</script>

<style scoped>

</style>