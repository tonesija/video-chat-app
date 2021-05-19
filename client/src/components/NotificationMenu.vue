<template>
<div class="ma-0 mp-0 relative">
  <v-icon small class="top-right" color="accent lighten-3"
    v-show="numOfNotifs != 0">
    mdi-numeric-{{numOfNotifs}}-circle</v-icon>

  <v-menu offset-y v-if="this.$store.state.isLoggedIn"
      rounded="lg" :close-on-content-click="false"
      @input="menuClicked" min-width="300px">
      <template v-slot:activator="{ on, attrs }">
          <v-btn
              v-bind="attrs" v-on="on" icon
              color="accent">
              <v-icon>mdi-bell</v-icon>
          </v-btn>
      </template>
      <NotificationList></NotificationList>
  </v-menu>
</div>

</template>

<script>
import NotificationList from './NotificationList'

export default {
  data:()=>{
    return {
      numOfNotifs: 0
    }
  },

  sockets: {
    notification: async function(){
      this.numOfNotifs++
    }
  },

  methods: {
    menuClicked() {
      this.numOfNotifs = 0
    }
  },

  created: async function() {
  },

  components: {
    NotificationList
  }
}
</script>

<style scoped>
  .top-right{
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
  }
  .relative{
    position: relative;
  } 
</style>