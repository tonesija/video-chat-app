<template>
  <v-container>
    <v-layout row>
      <v-flex v-for="m in messages" :key="m.id"
        xs12>
        <p>{{m.sender}} {{ m.content }} {{ m.createdAt }}</p>
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

  }
})
</script>
