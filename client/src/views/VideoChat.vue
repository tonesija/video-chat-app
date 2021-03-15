<template>
  <div class="home">
    <video :srcObject.prop="videoStream" autoplay 
    playsinline controls="false"></video>

    <video :srcObject.prop="remoteVideoStream" autoplay 
    playsinline controls="false"></video>

    <button @click="makeCall">Make call</button>
  </div>
</template>

<script>
import TestService from '../services/testService'

import RTCService from '../util/RTCService'

export default {
  name: 'Home',

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

      socket: null
    }
  },

  methods: {
    async makeCall() {
      RTCService.makeCall(this.pc, this.socket)
    }
  },

  created: function() {
    this.socket = this.$store.state.socket

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
    });

    //const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    this.pc = new RTCPeerConnection(this.iceConfiguration);
    

    RTCService.onMessageOffer(this.pc, this.socket)


    // Listen for local ICE candidates on the local RTCPeerConnection
    RTCService.onIceCandidate(this.pc, this.socket)

    // Listen for connectionstatechange on the local RTCPeerConnection
    RTCService.oneIceConnectionChange(this.pc)


    // Listen for remote ICE candidates and add them to the local RTCPeerConnection
    RTCService.onMessageIceCandidate(this.pc, this.socket)

    //get the remote stream
    this.remoteVideoStream = new MediaStream()
    RTCService.onTrack(this.pc, this.remoteVideoStream)
  },

  mounted: function() {
    TestService.test().then(res => {
      console.log('Test results: ', res.data)
    })
    .catch(err => {
      console.log('Test error: ', err)
    })
  },



  components: {
  }
}
</script>

<style scoped>

</style>