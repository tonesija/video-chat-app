<template>
  <div class="home">
    <v-container class="pl-0 pt-0">
      <v-toolbar class="secondary">
        <v-toolbar-title>
          {{otherUsername}}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-items>
          <v-btn icon>
            <v-icon>mdi-phone</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <ChatMsgs :messages="messages"></ChatMsgs>


      <v-text-field v-model="newMessage">
        <v-btn slot="append" @click="sendMessage">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-text-field>
      
    
      
    </v-container>
  </div>
</template>

<script>
import ChatMsgs from '../components/ChatMessages'

import MsgServ from '../services/chatService'
export default {
  name: 'Home',

  data: ()=> {
    return {
      otherUsername: null,
      newMessage: null,
      messages: []
    }
  },

  methods: {
    async sendMessage(){
      let payload = {
        content: this.newMessage,
        senderToken: localStorage.getItem('token'),
        reciverUsername: this.otherUsername
      }

      let msg = {
        content: this.newMessage,
        sender: this.$store.state.username,
        //TODO kako da postavim id? (mogu nakon slanja poruke httpom)
        //cekati i oda je poslati socketom
        id: Math.random() * 10000000
      }
      this.messages.push(msg)

      this.$socket.client.emit('new-message', {
        username: this.otherUsername,
        msg: msg
        })

      this.newMessage = null

      try{
        let data = (await MsgServ.sendMsg(payload)).data
        console.log(data)
      }catch(e){
        console.log(e)
      }
    },

    async getMessages(){
      let payload = {
        token: localStorage.getItem('token'),
        otherUsername: this.otherUsername
      }

      try{
        let data = (await MsgServ.getMessages(payload)).data
        console.log(data)

        this.messages = data.chatMessages
      }catch(e){
        console.log(e)
      }
    },

    onLoad(){
      this.otherUsername = this.$route.params.username
      this.getMessages()
    }
  },
  
  sockets: {
    newMessage: async function(msg) {
      console.log('dobijena poruka preko socketa: ', msg)
      this.messages.push(msg)
    }
  },

  created: function() {
    this.onLoad()
  },

  //on route change
  watch:{
    $route (to, from){
      console.log('In chat',to,from)
      if(to.name === from.name){
        this.onLoad()
      }
    }
  },

  destroyed: function() {
  },



  components: {
    ChatMsgs
  }
}
</script>

<style scoped>

</style>