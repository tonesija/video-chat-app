<template>
  <v-app>
    <Navbar></Navbar>
    <v-main class="">
      <v-card height="90vh" class="mx-10 pl-0" tile raised>
        <v-layout row class="mt-0 height100">
          <v-flex sm3 md2 class="hidden-xs-only primary">
            <Sidebar></Sidebar>
          </v-flex>

          <v-flex xs12 sm9 md10>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-card>

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
