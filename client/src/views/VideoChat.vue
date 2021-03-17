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
      pc: null
    }
  },

  sockets: {
    message: async function(message) {
      if (message.offer) {
        console.log('Got an offer')
        this.pc.setRemoteDescription(new RTCSessionDescription(message.offer));
        const answer = await this.pc.createAnswer();
        
        await this.pc.setLocalDescription(answer)
        this.$socket.emit('answer', answer)
      } else if (message.iceCandidate) {
        console.log('Got and ice candidate through message')
        try {
        console.log('Addin ice candidate to peer connection')
        await this.pc.addIceCandidate(message.iceCandidate);
        } catch (e) {
        console.error('Error adding received ice candidate', e);
        }
      }
    }
  },

  methods: {
    async makeCall() {
      //RTCServickeCall(this.pc, this.socket)
      console.log('Making call')
      this.$socket.$subscribe('message', async message => {
        if (message.answer) {
          console.log('Got an answer')
          const remoteDesc = new RTCSessionDescription(message.answer)
          await this.pc.setRemoteDescription(remoteDesc)
        }
      })

      var mediaConstraints = {
      'offerToReceiveAudio': true,
      'offerToReceiveVideo': true    
      };

      const offer = await this.pc.createOffer(mediaConstraints)
      await this.pc.setLocalDescription(offer)
      this.$socket.client.emit('offer', offer)
    }
  },

  created: function() {
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
  
    RTCService.onMessageOffer(this.pc, this.$socket.client)
    // Listen for local ICE candidates on the local RTCPeerConnection
    RTCService.onIceCandidate(this.pc, this.$socket.client)

    // Listen for connectionstatechange on the local RTCPeerConnection
    RTCService.oneIceConnectionChange(this.pc)

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

  destroyed: function() {
    this.$socket.$unsubscribe('message')
  }
}
</script>

<style scoped>

</style>