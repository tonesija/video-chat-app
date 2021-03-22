<template>
  <v-app>
    <Navbar></Navbar>
    <v-main class="mx-10">
      <v-card height="90vh" class="px-0" tile raised>
        <v-layout row class="mt-0 mx-0 height100">
          <v-flex sm3 md2 class="hidden-xs-only primary">
            <Sidebar></Sidebar>
          </v-flex>

          <v-flex xs12 sm9 md10>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-card>

      <v-dialog
        v-model="call"
        persistent
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">
            {{ caller }} vas zove.
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              text
              @click="denyCall"
            >
              Poklopi
            </v-btn>
            <v-btn
              color="success"
              text
              @click="acceptCall"
            >
              Odgovori
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-main>

  </v-app>
</template>

<script>
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

import authServ from './services/authenticationService'
export default {
  name: 'App',

  data() {
    return {
      call: false,
      caller: null
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
            email: data.user.email},
            token: data.token
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
    }
  },

  created: function() {
    this.automaticLogin()
  },

  components: {
    Navbar,
    Sidebar
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
