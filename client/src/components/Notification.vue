<template>
  <v-container class="mb-0 pt-0 relative">
    <v-btn icon small class="close-btn"
      @click="declineFriend">
      <v-icon>mdi-delete
      </v-icon>
    </v-btn>
    <p class="subtitle secondary--text font-weight-bold mb-0 mt-0"
      :class="{'subtitle': !notification.read,
      'caption': notification.read}">
      {{notification.title}}
    </p>

    <p class="secondary--text mb-0 pb-0">{{notification.content}}</p>
    <div v-show="notification.type == 'request'">
      <v-btn x-small color="success" @click="acceptFriend">
        Prihvati</v-btn>

      <v-btn x-small color="error" class="ml-1" outlined
        @click="declineFriend">
        Odbaci</v-btn>
    </div>
    <div v-show="notification.type == 'groupRequest'">
      <v-btn x-small color="success" @click="acceptGroupRequest">
        Prihvati</v-btn>

      <v-btn x-small color="error" class="ml-1" outlined
        @click="declineGroupRequest">
        Odbaci</v-btn>
    </div>
  </v-container>
</template>

<script>
import notificationService from '../services/notificationService'

export default {
  data:()=>{
    return {
    }
  },

  props: {
    notification: Object
  },

  methods: {
    async acceptFriend(){
      let otherUsername = this.notification.otherUserUsername
      try{
        await notificationService.acceptFriend(otherUsername)
      } catch(e){
        console.log(e)
      }
    },
    async declineFriend(){
      await notificationService.removeNotification(this.notification.id)
      this.$emit('update')
    },

    async acceptGroupRequest(){
      //let groupId = this.notification.groupId
      try{
        //TODO
        //await notificationService.acceptFriend(otherUsername)
      } catch(e){
        console.log(e)
      }
    },
    async declineGroupRequest(){
      await notificationService.removeNotification(this.notification.id)
      this.$emit('update')
    }
  }
}
</script>

<style scoped>
  .close-btn{
    position: absolute;
    top: -0.2em;
    right: -0.55em;
  }
  .relative {
    position: relative;
  }
</style>