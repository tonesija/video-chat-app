<template>
  <v-app>
    <Navbar></Navbar>
    <v-main class="">
      <router-view class="px-md-10 px-lg-10 
        px-xl-10 px-sm-5 px-xs-0 
        background height100"></router-view>

      <v-dialog
        v-model="call"
        persistent
        max-width="290"
        style="word-break: normal;"
      >
        <v-card>
          <v-card-title class="headline" style="word-break: normal;">
            {{ caller }} vas zove{{dots}}
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              icon class="mr-3" x-large
              @click="denyCall"
            >
              <v-icon>mdi-phone-hangup</v-icon>
            </v-btn>
            <v-btn
              color="success"
              fab
              @click="acceptCall"
            >
              <v-icon>mdi-phone</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-main>

  </v-app>
</template>

<script>
import Navbar from './components/Navbar'

import authServ from './services/authenticationService'
export default {
  name: 'App',

  data() {
    return {
      call: false,
      caller: null,

      dots: '.',
      dotInterval: null
    }
  },



  methods: {
    async automaticLogin(){
      let token = localStorage.getItem('token')
      if(token){
        console.log('token: ', token)
        try {
          let data = (await authServ.automaticLogin({token})).data

          //postavi korisnika u vuex
          this.$store.dispatch('setUser', {
            creds: {username: data.user.username,
              email: data.user.email,
              theme: data.user.theme,
              id: data.user.id},
            token: data.token,
            imgPath: data.user.imgPath,
            Vuetify: this.$vuetify
          })
        } catch (e) {
          console.log(e)
        }
      }
    },

    acceptCall(){
      this.call = false

      this.$socket.client.emit('call-accept', {
        sender: this.$store.state.username,
        reciver: this.caller
      })

      this.$store.dispatch('setPrivateCall', {callee: this.caller, caller: false})
    },

    denyCall(){
      this.call = false

      this.$socket.client.emit('call-denied', {
        sender: this.$store.state.username,
        reciver: this.caller
      })

      this.caller = null
    }
  },

  sockets: {
    async callRequest(sender) {
      this.caller = sender
      this.call = true

      this.dotInterval = setInterval(() => {
        if(this.dots === '...')
          this.dots = '.'
        else
          this.dots += '.'
      }, 500)
    },
    async abortCallRequest(sender){
      console.log('Call aborted by ', sender)
      this.caller = null
      this.call = false

      clearInterval(this.dotInterval)
    }
  },

  created: function() {
    this.automaticLogin()
  },

  components: {
    Navbar
  }
}
</script>


<style>
.height100 {
  height: 100%;
}
.v-application {
    background-color: #d3eaf8 !important;
}
</style>
