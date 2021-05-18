<template>
  <v-container class="notification-list">
    <div v-for="n in notifications" :key="n.key">
      <Notification :notification="n"></Notification>
    </div>
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
  
  },

  sockets: {
    //realtime dobivanje notifikacija
  },

  created: async function() {
    try{
      let data = (await notificationService.getNotifications()).data
      this.notifications = data.notifications
      console.log(data.notifications)
    } catch(e){
      console.log(e)
    }
  },

  components: {
    Notification
  }
}
</script>
