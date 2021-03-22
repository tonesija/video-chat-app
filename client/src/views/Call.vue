<template>
  <div class="Call">
    <p>{{$route.params.username}}</p>

    <video :srcObject.prop="videoStream" autoplay 
    playsinline controls="false"></video>

    <video :srcObject.prop="remoteVideoStream" autoplay 
    playsinline controls="false"></video>
  </div>
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

      otherUser: null
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
      }

      const offer = await this.pc.createOffer(mediaConstraints)
      await this.pc.setLocalDescription(offer)
      this.$socket.client.emit('offer', {offer: offer, reciver: this.otherUser})
    }

  },

  created: function() {
    this.otherUser = this.$route.params.username

    navigator.mediaDevices.getUserMedia(this.constraints)
    .then(stream => {
        console.log('Got MediaStream:', stream)
        this.videoStream = stream
        //add the tracks to RTCPeerConnection
        this.videoStream.getTracks().forEach(track => {
          this.pc.addTrack(track, this.videoStream)
          console.log('Adding track to peer connection!')
        })
    })
    .catch(error => {
        console.error('Error accessing media devices.', error)
    })

    this.pc = new RTCPeerConnection(this.iceConfiguration)

    // Listen for local ICE candidates on the local RTCPeerConnection
    RTCService.onIceCandidate(this.pc, this.$socket.client, this.otherUser)

    // Listen for connectionstatechange on the local RTCPeerConnection
    RTCService.oneIceConnectionChange(this.pc)

    //get the remote stream
    this.remoteVideoStream = new MediaStream()
    RTCService.onTrack(this.pc, this.remoteVideoStream)

    if(this.$store.state.caller){
      this.makeCall()
    }
  },

  destroyed: function() {
    //update vuex private call state
    this.$store.dispatch('setPrivateCall', {callee: null})

    this.$socket.$unsubscribe('message')
  },



  components: {
  }
}
</script>

<style scoped>

</style>