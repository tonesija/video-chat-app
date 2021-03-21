<template>
  <v-app>
    <Navbar></Navbar>
    <v-main class="mx-10 mb-5">
      <v-layout row class="mt-0">
        <v-flex sm3 md2 class="hidden-xs-only blue">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel saepe veniam quos dicta vero! Distinctio fugit, ullam nesciunt eius odit quos nobis quibusdam perspiciatis, nam unde, blanditiis magnam temporibus. Maxime?</p>
        </v-flex>

        <v-flex xs12 sm9 md10>
          <router-view></router-view>
        </v-flex>
      </v-layout>
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
    Navbar
  }
}
</script>


<style>
</style>
