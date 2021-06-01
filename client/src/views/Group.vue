<template>
  <v-container class="group" v-if="group">
    <h1>{{group.name}}</h1>
    <GroupMembers :group="group"></GroupMembers>

    <ChatMsgs></ChatMsgs>
    <ChatInput></ChatInput>
  </v-container>
</template>

<script>
import ChatMsgs from '../components/ChatMessages'
import ChatInput from '../components/ChatInput'
import GroupMembers from '../components/GroupMembers'

import groupService from '../services/groupService'
export default {
  data(){
    return {
      group: null
    }
  },

  methods: {
    async loadGroup(){
      try {
        let data = (await groupService.getGroup(this.$route.params.groupName)).data
        this.group = data.group
        console.log(data)
      } catch(e){
        console.log(e)
      }
    }
  },

  created: async function(){
    this.loadGroup()
  },

  watch:{
    $route (to, from){
      if(to.name === from.name){
        this.loadGroup()
      }
    }
  },


  components: {
    ChatInput,
    ChatMsgs,
    GroupMembers
  }
}
</script>
