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

    <ChatMsgs style="max-height: 650px" ref="chat-msgs"
      class="overflow-y-auto mb-3" :messages="messages"></ChatMsgs>
    <ChatInput v-model="newMessage" @messageSent="sendMessage"></ChatInput>
  </div>
</template>

<script>
import ChatMsgs from '../components/GroupChatMessages'
import ChatInput from '../components/ChatInput'
import GroupMembers from '../components/GroupMembers'
import GroupMenu from '../components/GroupMenu'

import groupService from '../services/groupService'
export default {
  data(){
    return {
      group: null,
      messages: [],
      newMessage: null
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
      } catch(e){
        console.log(e)
      }
    },

    async enterCall(){
      this.$router.push('/group-call/'+this.group.id)
    },

    async getMessages(){
      try{
        let data = (await groupService.getMessages(
          this.group.id
        )).data
        this.messages = data.chatMessages
        this.scrollToBottom('chat-msgs')
      }catch(e){
        console.log(e)
      }
    },

    async sendMessage(){
      if(!this.newMessage) return
      this.newMessage = this.newMessage.trim()
      if(this.newMessage === '') return

      try{
        let data = (await groupService.sendMessage(
          this.group.id,
          this.newMessage
        )).data
        data.chatMessage.User = {}
        data.chatMessage.User.username = this.$store.state.username
        this.$socket.client.emit('new-group-message', {
          sender: this.$store.state.username,
          groupId: this.group.id,
          msg: data.chatMessage
        })
        this.newMessage = null
      }catch(e){
        console.log(e)
      }
    },

    scrollToBottom(ref){
      setTimeout(() => {
        this.$refs[ref].$el.scrollTop = this.$refs[ref].$el.scrollHeight
      }, 50)
    }
  },

  sockets: {
    newGroupMessage: async function(msg) {
      if(msg.GroupId == this.group.id){
        this.messages.push(msg)
        this.scrollToBottom('chat-msgs')
      }
    }
  },

  created: async function(){
    this.loadGroup().then(()=>{
      this.getMessages()
    })
  },

  watch:{
    $route (to, from){
      if(to.name === from.name){
        this.loadGroup().then(()=>{
          this.getMessages()
        })
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
