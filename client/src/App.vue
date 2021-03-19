<template>
  <v-app>
    <div>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/video-chat">Video Chat (test)</router-link>
    </div>

    <Navbar></Navbar>
    <v-main class="mx-5 mb-5">
      <v-layout row>
        <v-flex sm2 md1 class="hidden-xs-only">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel saepe veniam quos dicta vero! Distinctio fugit, ullam nesciunt eius odit quos nobis quibusdam perspiciatis, nam unde, blanditiis magnam temporibus. Maxime?</p>
        </v-flex>

        <v-flex xs12 sm10 md11>
          <router-view></router-view>
        </v-flex>
      </v-layout>
    </v-main>

  </v-app>
</template>

<script>
import Navbar from './components/Navbar'
export default {
  name: 'App',

  data() {
    return {
    }
  },

  methods: {

  },

  created: function() {
  },

  components: {
    Navbar
  }
}
</script>


<style>
</style>
