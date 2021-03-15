<template>
  <div class="home">
    
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  name: 'Home',

  data: ()=> {
    return {
      socket: io(process.env.VUE_APP_ENV_BASE_URL)
    }
  },

  methods: {
  
  },

  created: function() {
    
  },

  mounted: function() {

  },



  components: {
  }
}
</script>

<style scoped>

</style>