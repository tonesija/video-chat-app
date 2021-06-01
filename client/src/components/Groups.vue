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

      <v-row align="center" justify="center" >
      <v-menu offset-y :close-on-content-click="false"
          rounded="lg">
        <template v-slot:activator="{on, attrs}">
            <v-btn
            color="accent"
            v-bind="{attrs: attrs}"
            v-on="on"
            small
            >
            Stvori novu grupu
            </v-btn>
        </template>
        <v-container class="primary lighten-1">
          <v-layout row class="py-2 px-2" justify-space-between align-center>
            <v-flex xs9>
              <v-text-field class=""
                  dense placeholder="Ime grupe"
                  single-line v-model="newGroupName">
              </v-text-field>
            </v-flex>
            <v-flex xs3>
                <v-btn icon class="accent ml-3"
                @click="createNewGroup" fab small>
                    <v-icon color="white">mdi-plus</v-icon>
                </v-btn>
            </v-flex>
                
        </v-layout>
        <v-row justify="center">
            <v-alert
                transition="fade-transition"
                border="left"
                v-show="newGroupMsg"
                dense
                :type="newGroupAlertType"
                class="caption"
            >
                {{ newGroupMsg }}
            </v-alert>
          </v-row> 
        </v-container>
      </v-menu>
    </v-row>

  </v-container>
</template>

<script>
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
      if(to.fullPath == '/')
          this.getGroups()
    }
  },

  created: function(){
    this.getGroups()
  }
}
</script>
