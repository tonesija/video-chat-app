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
export default {
  name: 'Home',

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
      for(let user of this.users){
        if(user.username != this.localUsername){
          this.pcs.set(user.username, new RTCPeerConnection(this.iceConfiguration))
        }
      }
      this.inCall = true

      //ask for camera and mic access
      navigator.mediaDevices.getUserMedia(this.constraints)
      .then(stream => {
          console.log('Got MediaStream:', stream)
          this.videoStream = stream;
          //add the tracks to RTCPeerConnection
          this.videoStream.getTracks().forEach(track => {
            console.log('Adding tracks to peer connection!')
            for(let pc of this.pcs.values()){
              pc.addTrack(track, this.videoStream)
            }
          })
      })
      .catch(error => {
          console.error('Error accessing media devices.', error)
      })



      //get the remote stream
      for(let username of this.pcs.keys()){
        let newMediaStream = new MediaStream()
        let remoteStream = {username: username, mediaStream: newMediaStream}
        this.remoteVideoStreams.push(remoteStream)
        this.pcs.get(username).addEventListener('track', event => {
          console.log('Got a track from ', username)
          newMediaStream.addTrack(event.track, newMediaStream)
          

        })
      }

      console.log('pcs: ', this.pcs.values())
      //ice candidates
      for(let pc of this.pcs.values()) {
        console.log('pc: ', pc)
        pc.addEventListener('icecandidate', event => {
          if(event.candidate){
            console.log('ice c: ', event)
            this.$socket.client.emit('new-ice-candidate', {candidate: event.candidate, username: this.localUsername})
          }
        })
      }


      //ice connection change
      for(let pc of this.pcs.values()){
        pc.addEventListener('iceconnectionstatechange', event => {
          if(pc.iceConnectionState === 'connected'){
            console.log('Peers connected ', event)
            console.log('Remote streams: ', this.remoteVideoStreams)
          }
        })
      }




      this.$socket.$subscribe('message', async ({message, username}) => {
        if (message.answer) {
          console.log('Got an answer from ', username)
          const remoteDesc = new RTCSessionDescription(message.answer)
          //quick fix before upgrading the signaling (correct users get correct signals) 
          try {
            await this.pcs.get(username).setRemoteDescription(remoteDesc)
          } catch(e){
            //ignore
          }
          
        }
      })

      var mediaConstraints = {
      'offerToReceiveAudio': true,
      'offerToReceiveVideo': true    
      };

      //TODO dirty hack
      setTimeout(async() => {
        for(let pc of this.pcs.values()){
        console.log('Creating offer')
        const offer = await pc.createOffer(mediaConstraints)
        await pc.setLocalDescription(offer)
        this.$socket.client.emit('offer', {offer: offer, username: this.localUsername})
      }
      }, 1000)

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

    message: async function({message, username}) {
      if(!this.inCall) return
      console.log(message, username)
      if(message.offer){
        //popup join call
        console.log('Got an offer from ', username)
        this.pcs.get(username).setRemoteDescription(new RTCSessionDescription(message.offer))
        const answer = await this.pcs.get(username).createAnswer()

        await this.pcs.get(username).setLocalDescription(answer)
        this.$socket.client.emit('answer', {answer: answer, username: this.localUsername})
      } else if(message.iceCandidate) {
        console.log('Got a new icecandidate through message ', username)
        try {
          console.log('Addin ice candidate to peer connection')
          await this.pcs.get(username).addIceCandidate(message.iceCandidate);
        } catch (e) {
          console.error('Error adding received ice candidate', e);
        }
      }
    }
  },

  created: function() {
    this.room = this.$route.params.roomName
    this.localUsername = this.$store.state.username

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