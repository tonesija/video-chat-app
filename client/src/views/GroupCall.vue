<template>
  <v-container class="height100">
    <h1>{{$route.params.groupId}}</h1>
    <v-row align="center" justify="center"
      v-for="remoteVideoStream in remoteVideoStreams"
        :key="remoteVideoStream.key">
      <v-menu offset-y :close-on-content-click="false"
      rounded="lg" bottom>
        <template v-slot:activator="{ on, attrs }">
          <video
          :srcObject.prop="remoteVideoStream.mediaStream" autoplay 
          playsinline :controls="false"
          width="640" height="480"
          v-bind="{attrs: attrs}"
          v-on="on"
          :poster="baseUrl+''+users.get(remoteVideoStream.username).imgPath"
          >
          </video>
        </template>
        <v-layout row justify-center class="primary lighten-3 px-2 pb-0 ma-0">
          <v-flex class="pa-0 ma-0">
            <p class="subtitle mb-0">{{remoteVideoStream.username}}</p>
            <v-slider v-model="volume" @change="changeVolume"
            dense>
            </v-slider>
          </v-flex>
        </v-layout>
      </v-menu>
    </v-row>

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
    
    <CallFooter v-on:hangUp="hangUp()"
      v-on:cameraSwitch="manageCamera"
      @micSwitch="manageMic">
    </CallFooter>
  </v-container>
</template>

<script>
import CallFooter from '../components/CallFooter'
import groupService from '../services/groupService'

import RTCService from '../util/RTCService'
export default {
  data: ()=> {
    return {
      localUsername: null,
      groupId: null,
      pcs: null,

      constraints: {
        video: true,
        audio: true
      },

      videoStream: null,
      volume: 50,

      users: null,

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

  computed: {
    volumeAdj: function(){
      return this.volume/100
    },
    baseUrl () {
        return process.env.VUE_APP_ENV_BASE_URL
    }
  },

  methods: {
    async joinCall(){
      //create pcs map
      this.pcs = new Map()

      this.$socket.client.emit('user-joined-call', 
        {username: this.localUsername, groupId: this.$route.params.groupId})

      //onMessageIceCandidate
      this.$socket.client.on('messageGroup', async (message) => {
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
      this.$socket.client.on('messageGroup', async (message) => {
        if (message.answer && message.reciver === this.localUsername) {
          console.log('Got an answer from ', message.sender)
          const remoteDesc = new RTCSessionDescription(message.answer)
          //quick fix before upgrading the signaling (correct users get correct signals) 
          if(!this.pcs.get(message.sender).currentRemoteDescription)
            await this.pcs.get(message.sender).setRemoteDescription(remoteDesc)
        }
      })

      //--- on offer ---
      this.$socket.client.on('messageGroup', async (message) => {
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
          this.$socket.client.emit('answer-group', {answer: answer,
            sender: this.localUsername, reciver: message.sender})
        }
      })
    },

    manageMic(on){
      if(on)
        this.videoStream.getAudioTracks()[0].enabled = true
      else 
        this.videoStream.getAudioTracks()[0].enabled = false
    },
    manageCamera(on){
      if(on)
        this.turnOnCamera()
      else
        this.videoStream.getVideoTracks()[0].enabled = false
    },
    turnOnCamera(){
      if(this.videoStream.getVideoTracks().length != 0){
        this.videoStream.getVideoTracks()[0].enabled = true
        return
      }
      RTCService.onNegotiationNeededGroup(this.pcs,
        this.$socket.client, this.localUsername)
      navigator.mediaDevices.getUserMedia({video:true})
      .then(stream => {
        console.log('Got MediaStream:', stream)
        //add camera track and prepare for renegotiation
        stream.getTracks().forEach(track => {
          this.videoStream.addTrack(track)
          for(let [username, pc] of this.pcs){
            console.log(username)
            pc.addTrack(track, this.videoStream)
          }
          console.log('Adding track to peer connection!')
        })
      })
    },
    changeVolume(){
      this.$refs['otherVideo'].volume = this.volumeAdj
    },
    hangUp(){
      this.$router.go(-1)
    },

    async getGroupMembers(){
      try {
        let data = (await groupService.getGroupMembers(this.groupId)).data
        for(let user of data.members){
          this.users.set(user.username, user)
        }
      } catch(e){
        console.log(e)
      }
    },

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
    },
    userLeaveGroupCall: async function(username){
      this.pcs.delete(username)
      let i
      for(i=0; i<this.remoteVideoStreams.length; ++i){
        if(this.remoteVideoStreams[i].username == username)
          break
      }
      this.remoteVideoStreams.splice(i, 1)
    }
  },

  created: function() {
    this.localUsername = this.$store.state.username
    this.groupId = this.$route.params.groupId
    this.users = new Map()
    this.getGroupMembers()
    //ask for camera and mic access
    navigator.mediaDevices.getUserMedia({audio:true})
    .then(stream => {
        this.videoStream = stream
        this.joinCall()
    })
    .catch(error => {
        console.error('Error accessing media devices.', error)
    })
  },

  destroyed: function() {
    console.log('cleaning')
    this.$socket.client.off('messageGroup')
    this.$socket.client.emit('user-leave-group-call', {
      username: this.localUsername, groupId: this.groupId
    })
    //turn off mic and camera
    this.videoStream.getTracks().forEach(track => {
      track.stop()
    })
  },

  components: {
    CallFooter
  }
}
</script>