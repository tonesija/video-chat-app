<template>
  <div class="home">
    <v-toolbar class="primary">
      <v-avatar size="42" class="mr-2" v-if="otherUser && otherUser.imgPath">
        <img :src="`${baseUrl}${otherUser.imgPath}`"/>
      </v-avatar>
      <v-toolbar-title class="accent--text font-weight-bold">
        {{otherUsername}}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn icon @click="call" class="accent--text">
          <v-icon large>mdi-phone</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-container class="px-3 pt-4 mx-0 mr-0" style="max-height: 100%; width: 100%;">
        
        <ChatMsgs style="max-height: 650px" ref="chat-msgs"
          class="overflow-y-auto mb-3" :messages="messages"></ChatMsgs>
        
      <ChatInput v-model="newMessage" @messageSent="sendMessage"></ChatInput>


      <v-dialog
        v-model="dialog"
        persistent
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline" style="word-break: normal;">
            Čekam odgovor od {{otherUsername}}{{dots}}
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              fab
              @click="abortCallRequest"
            >
              <v-icon>mdi-phone-hangup</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    
      
    </v-container>
  </div>
</template>

<script>
import ChatMsgs from '../components/ChatMessages'
import MsgServ from '../services/chatService'
import ChatInput from '../components/ChatInput'
import friendsService from '../services/friendsService'

export default {
  name: 'Home',

  data: ()=> {
    return {
      otherUsername: null,
      otherUser: null,
      newMessage: null,
      messages: [],

      dialog: false,
      dots: '.',
      dotInterval: null
    }
  },

  computed: {
    baseUrl () {
      return process.env.VUE_APP_ENV_BASE_URL
    }
  },

  methods: {
    async sendMessage(){
      if(!this.newMessage) return
      this.newMessage = this.newMessage.trim()
      if(this.newMessage === '') return
      

      let payload = {
        content: this.newMessage,
        senderToken: localStorage.getItem('token'),
        reciverUsername: this.otherUsername
      }

      let msg = {
        content: this.newMessage,
        user1: {
          username: this.$store.state.username
        },
        //TODO kako da postavim id? (mogu nakon slanja poruke httpom)
        //cekati i oda je poslati socketom
        id: Math.random() * 10000000,
        createdAt: new Date()
      }
      this.messages.push(msg)
      this.scrollToBottom('chat-msgs')

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
        this.scrollToBottom('chat-msgs')
      }catch(e){
        console.log(e)
      }
    },

    call(){
      this.$socket.client.emit('call-request', {
        sender: this.$store.state.username,
        reciver: this.otherUsername
      })
      this.dialog = true

      this.dotInterval = setInterval(() => {
        if(this.dots === '...')
          this.dots = '.'
        else
          this.dots += '.'
      }, 500)
    },

    abortCallRequest(){
      this.dialog = false
      this.$socket.client.emit('abort-call-request', {
        reciver: this.otherUsername,
        sender: this.$store.state.username
      })
      clearInterval(this.dotInterval)
    },

    async onLoad(){
      this.otherUsername = this.$route.params.username
      this.getMessages()

      this.otherUser = (await friendsService.getUser(
              {username: this.otherUsername})).data.user
    },

    scrollToBottom(ref){
      setTimeout(() => {
        this.$refs[ref].$el.scrollTop = this.$refs[ref].$el.scrollHeight
      }, 50)
    }
  },
  
  sockets: {
    newMessage: async function(msg) {
      console.log('dobijena poruka preko socketa: ', msg)
      if(msg.user1.username !== this.$route.params.username)
        return
      this.messages.push(msg)
      this.scrollToBottom('chat-msgs')
    },

    callDenied: async function(sender) {
      console.log('Poziv odbijen od ', sender)

      this.dialog = false
      //TODO alert da je poziv odbijen
    },

    callAccept: async function(sender) {
      console.log('Poziv prihvaćen od ', sender)
      this.dialog = false

      this.$store.dispatch('setPrivateCall', {callee: sender, caller: true})
    }
  },

  created: function() {
    this.onLoad()

    //document.addEventListener('keydown', this.onKeyPress)
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
    document.removeEventListener('keydown', this.onKeyPress)
    clearInterval(this.dotInterval)
  },



  components: {
    ChatMsgs,
    ChatInput
  }
}
</script>

<style scoped>
.height100 {
  height: 100%;
}

.message-sender {
  position: absolute;
  bottom: 0px;
}
</style>