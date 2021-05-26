<template>
  <v-container>   
    <v-row align="center" justify="center" class="mt-1">
        <p class="subtitle secondary--text font-weight-bold">Grupe</p>
    </v-row>

    <v-row align="center" justify="start" class="pa-0 ma-0">
      <v-list class="primary pa-0 ma-0" width="100%">
        <v-list-item class="pa-0 ma-0" dense
          router :to="'/group/'+g.id"
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
  </v-container>
</template>

<script>
import groupService from '../services/groupService'
export default {
  data:() => {
    return {
      groups: null
    }
  },

  methods: {
    async getGroups(){
      try {
        let data = (await groupService.getGroups())
        this.groups = data.data.groups
      } catch(e){
        console.log(e)
      }
    }
  },

  created: function(){
    this.getGroups()
  }
}
</script>
