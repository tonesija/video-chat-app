<template>
  <v-container class="notification-list">
    <div v-for="n in notifications" :key="n.key">
      <Notification :notification="n"
        @update="getNotifications"></Notification>
    </div>
    <v-row justify="center" class="mt-1">
      <p class="secondary--text subtitle font-weight-light"
          v-show="notifications.length == 0">
          Lista notifikacija je prazna
      </p>
    </v-row>
  </v-container>
</template>

<script>
import Notification from './Notification'
import notificationService from '../services/notificationService'

export default {
  data:()=>{
    return {
      notifications: []
    }
  },

  methods: {
    async getNotifications(){
      try{
        let data = (await notificationService.getNotifications()).data
        this.notifications = data.notifications
        console.log(data.notifications)
      } catch(e){
        console.log(e)
      }
    }
  },

  sockets: {
    updateNotifications: async function(){
      this.getNotifications()
    },
    notification: async function(){
      this.getNotifications()
    }
  },

  created: async function() {
    this.getNotifications()
  },

  components: {
    Notification
  }
}
</script>

<style scoped>
  .notification-list {
    background-color: rgb(255,255,255,0.8);
  }
</style>
