<template>
  <div class="home" v-if="group">
    <v-toolbar class="primary">
      <v-avatar size="42" class="mr-2" v-if="group && group.imgPath">
        <img :src="`${baseUrl}${group.imgPath}`"/>
      </v-avatar>
      <v-toolbar-title class="accent--text font-weight-bold">
        {{group.name}}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn icon @click="enterCall" class="accent--text">
          <v-icon large>mdi-phone</v-icon>
        </v-btn>
      </v-toolbar-items>

      <v-toolbar-items>
        <GroupMembers :group="group"></GroupMembers>
      </v-toolbar-items>

      <v-toolbar-items>
        <GroupMenu :group="group"></GroupMenu>
      </v-toolbar-items>
    </v-toolbar>

    <ChatMsgs></ChatMsgs>
    <ChatInput></ChatInput>
  </div>
</template>

<script>
import ChatMsgs from '../components/ChatMessages'
import ChatInput from '../components/ChatInput'
import GroupMembers from '../components/GroupMembers'
import GroupMenu from '../components/GroupMenu'

import groupService from '../services/groupService'
export default {
  data(){
    return {
      group: null
    }
  },

  computed: {
    baseUrl () {
      return process.env.VUE_APP_ENV_BASE_URL
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
    },

    async enterCall(){
      console.log('TODO')
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
    GroupMembers,
    GroupMenu
  }
}
</script>
