<template>
  <v-container>   
    <v-row align="center" justify="center" class="mt-1">
        <p class="subtitle secondary--text font-weight-bold">Grupe</p>
    </v-row>

    <v-row align="center" justify="start" class="pa-0 ma-0">
      <v-list class="primary pa-0 ma-0" width="100%">
        <v-list-item class="pa-0 ma-0" dense
          router :to="'/group/'+g.name"
          v-for="g in groups" :key="g.id">
          <v-list-item-action>
            <div>
              <v-avatar size="32"
                  color="secondary">
              </v-avatar>
            </div>
          </v-list-item-action>
          <v-list-item-title class="caption">
              {{g.name}}
          </v-list-item-title>
          <v-icon 
              color="accent"
              fab >
              mdi-numeric-9-circle
          </v-icon>
        </v-list-item>
      </v-list>
    </v-row>

    <v-row align="center" justify="center">
      <CreationInput :title="'Stvori novu grupu'"
        :placeholder="'Ime grupe'" @add="createNewGroup"
        v-model="newGroupName" :errorType="newGroupAlertType"
        :error="newGroupMsg"></CreationInput>
    </v-row>

  </v-container>
</template>

<script>
import CreationInput from './CreationInput'

import groupService from '../services/groupService'
export default {
  data:() => {
    return {
      groups: null,
      
      newGroupName: null,
      newGroupMsg: null,
      newGroupAlertType: null,
    }
  },

  methods: {
    async getGroups(){
      try {
        let data = (await groupService.getGroups())
        this.groups = data.data.groups
        console.log(this.groups)

        //join-room event
        for(let group of this.groups){
          this.$socket.client.emit('join-room', {
            groupId: group.id
          })
        }
        
      } catch(e){
        console.log(e)
      }
    },

    async createNewGroup(){
      try {
        await groupService.createGroup(this.newGroupName)
        this.newGroupAlertType = 'success'
        this.newGroupMsg = 'Grupa uspješno stvorena.'
        this.getGroups()
      } catch(e){
        console.log(e)
        this.newGroupAlertType = 'error'
        this.newGroupMsg = e.response.data.message
      }
    }
  },

  watch:{
    $route (to){
      if(to.fullPath == '/' || to.fullPath.startsWith('/group'))
        this.getGroups()
    }
  },

  created: function(){
    this.getGroups()
  },

  components: {
    CreationInput
  }
}
</script>
