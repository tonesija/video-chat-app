<template>
  <v-container>
    <v-layout row >
      <v-flex v-for="m in messages" :key="m.id"
        xs12>
        <v-card outlined elevation="1" class="mt-2 mr-2 pa-1" :class="{'ml-10 primary lighten-1': isAuthorThis(m.user1.username),
                                                                      'mr-10': !isAuthorThis(m.user1.username) }">
          <v-layout row justify-space-between align-content-space-between class="pa-0 ma-0">
            <v-flex xs8>
              <p class="subtitle primary--text text--darken-2">{{m.user1.username}}</p>
            </v-flex>
            <v-flex xs4 class="caption grey--text">
              <p>{{m.createdAt}}</p>
            </v-flex>

            <v-flex xs12>
              <p>{{m.content}}</p>
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
    //id, createdAt, content, sender
    messages: Array
  },

  methods: {
    isAuthorThis(username){
      return this.$store.state.username === username
    }
  },

  created: function() {
  }
})
</script>
