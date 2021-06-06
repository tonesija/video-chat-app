<template>
  <v-container>
    <v-layout row >
      <v-flex v-for="m in messages" :key="m.id"
        xs12>
        <v-card outlined elevation="1" class="mt-2 mr-2 pa-1" :class="{'ml-10 primary primary lighten-1': isAuthorThis(m.UserId),
                                                                      'mr-10': !isAuthorThis(m.UserId) }">
          <v-layout row justify-end align-start class="pa-0 ma-0">
            <v-flex xs10 sm11>
              <p class="ma-0 pa-0 subtitle secondary--text font-weight-bold">{{m.User.username}}</p>
            </v-flex>
            <v-flex xs2 sm1 class="caption grey--text">
              <p class="ma-0 pa-0">{{formatDate(m.createdAt)}}</p>
            </v-flex>

            <v-flex xs12>
              <p class="ma-0 pa-0">{{m.content}}</p>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default ({
  data:() => {
    return {
    }
  },

  props: {
    messages: Array
  },

  methods: {
    isAuthorThis(id){
      return this.$store.state.id === id
    },

    getDate(d){
      let date = d.getMonth() + '.' + d.getUTCDate()
      return date
    },

    formatDate(date){
      let d = new Date(date)
      let now = new Date()
      let hours = d.getUTCHours()
      let minutes = d.getUTCMinutes()

      if(now.getFullYear() != d.getFullYear()){
        return this.getDate(d) + " " + hours + ':' + minutes
      } else if (now.getMonth() != d.getMonth()){
        return this.getDate(d) + " " + hours + ':' + minutes
      } else if(now.getUTCDate() != d.getUTCDate()){
        return this.getDate(d) + " " + hours + ':' + minutes
      }
      
      return hours + ':' + minutes
    }
  },

  created: function() {
  }
})
</script>

<style scoped>

</style>
