<template>
  <div class="notification">
    <v-container>
      <p class="subtitle secondary--text font-weight-bold">{{notification.title}}</p>

      <p class="secondary--text">{{notification.content}}</p>
    </v-container>
  </div>
</template>

<script>

export default {
  data:()=>{
    return {
    }
  },

  props: {
    notification: Object
  },

  methods: {
  
  },

  computed: {
 
  }
}
</script>
