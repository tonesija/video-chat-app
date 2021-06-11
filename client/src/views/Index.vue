<template>
    <v-container class="index pt-8">
      <v-img class="bg-image"
          src="../assets/white-bg.png"
          gradient="var(--v-background-base), var(--v-primary-base)">
        </v-img>
      <v-row align="center" justify="center">
        <v-card color="primary lighten-2"
          elevation="8" outlined v-if="!$store.state.isLoggedIn">
          <v-card-text>
            <p class="title secondary--text text-width">
              <span class="secondary--text">
              Video<span class="font-weight-light">Chat
              </span></span>
              je web aplikacija za video pozive. Korištenje
              aplikacije zahtijeva registraciju.
            </p>
          </v-card-text> 
        </v-card>

        <v-card color="primary lighten-2"
          elevation="8" outlined v-if="$store.state.isLoggedIn">
          <v-card-text>
            <p class="title secondary--text text-width">
              {{$store.state.username}} dobrodošao u
              <span class="secondary--text">
              Video<span class="font-weight-light">Chat</span></span>.
            </p>
          </v-card-text> 
        </v-card>
      </v-row>
    </v-container>
</template>

<script>
export default {
  name: 'Index',

  data: ()=> {
    return {
    }
  },

  methods: {

  },
  
  sockets: {

  },

  created: function() {
  },

  destroyed: function() {
  },



  components: {
  }
}
</script>

<style scoped>
.text-width {
  width: 50vw;
}
.bg-image{
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}
</style>