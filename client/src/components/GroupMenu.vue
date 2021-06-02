<template>
  <v-menu offset-y :close-on-content-click="false"
      rounded="lg">
    <template v-slot:activator="{on, attrs}">
        <v-btn color="accent"
        v-bind="{attrs: attrs}" v-on="on" large icon>
        <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
    </template>
    <v-container class="pa-0 ma-0">
      <v-list class="white" width="100%">
        <v-list-item>
            <v-menu offset-x left :close-on-content-click="false">
              <template v-slot:activator="{on, attrs}">
              <v-list-item v-bind="{attrs: attrs}" v-on="on" 
                class="ma-0 pa-0">
                  <v-list-item-action>
                      <v-icon>mdi-account-plus</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>
                      Pozovi člana
                  </v-list-item-title>
              </v-list-item>
              </template>
              <CreationInputBox :placeholder="'Korisničko ime'"
                v-model="newGroupMemberUsername" :error="newGroupMemberError"
                :errorType="newGroupMemberAlertType" @add="addNewMember">
              </CreationInputBox>
            </v-menu>
        </v-list-item>
        <v-list-item v-show="group.creatorId == userId"
          @click="deleteGroup">
          <v-list-item-action>
              <v-icon>mdi-trash-can</v-icon>
          </v-list-item-action>
          <v-list-item-title>
              Izbriši grupu
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-show="group.creatorId != userId"
          @click="leaveGroup">
          <v-list-item-action>
              <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-action>
          <v-list-item-title>
              Izađi iz grupe
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-container>
  </v-menu>

</template>

<script>
import CreationInputBox from './CreationInputBox'

import groupService from '../services/groupService'
export default {
  data:() => {
    return {
      userId: null,

      newGroupMemberUsername: null,
      newGroupMemberError: null,
      newGroupMemberAlertType: null
    }
  },

  props: {
    group: Object
  },

  computed: {
    baseUrl () {
      return process.env.VUE_APP_ENV_BASE_URL
    }
  },

  methods: {
    async deleteGroup(){
      try{
        await groupService.deleteGroup(this.group.name)
        this.$router.push('/')
      }catch(e){
        console.log(e)
      }
    },

    async leaveGroup(){
      try{
        await groupService.leaveGroup(this.group.id)
        this.$router.push('/')
      }catch(e){
        console.log(e)
      }
    },

    async addNewMember(){
      try {
        await groupService.sendGroupRequest(this.group.id
          , this.newGroupMemberUsername)
        this.newGroupMemberAlertType = 'success'
        this.newGroupMemberError = 'Posan zahtjev korisniku.'
      } catch(e){
        this.newGroupMemberAlertType = 'error'
        this.newGroupMemberError = e.response.data.message
      }
    }
  },

  created: function(){
    this.userId = this.$store.state.id
  },

  components:{
    CreationInputBox
  }
}
</script>
