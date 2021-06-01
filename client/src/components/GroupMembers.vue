<template>
  <v-container>   
    <v-row align="center" justify="center" >
      <v-menu offset-y :close-on-content-click="false"
          rounded="lg">
        <template v-slot:activator="{on, attrs}">
            <v-btn color="accent"
            v-bind="{attrs: attrs}" v-on="on" small>
            Članovi
            </v-btn>
        </template>
        <v-container class="pa-0 ma-0">
          <v-list class="primary" width="100%">
            <v-list-item class="pa-0 ma-0" dense
              v-for="m in groupMembers" :key="m.id">
              <v-list-item-action>
                <div>
                  <v-avatar size="32" v-if="m.imgPath">
                      <img v-if="m.imgPath" 
                          :src="`${baseUrl}${m.imgPath}`"/>
                  </v-avatar>
                  <v-avatar size="32" v-if="!m.imgPath"
                      color="secondary">
                  </v-avatar>
                </div>
              </v-list-item-action>
              <v-list-item-title class="caption">
                  {{m.username}}
              </v-list-item-title>
            </v-list-item>
          </v-list>
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
      groupMembers: []
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
    async getGroupMembers(){
      try {
        let data = (await groupService.getGroupMembers(this.group.id)).data
        this.groupMembers = data.members
        console.log("aa",this.groupMembers)
      } catch(e){
        console.log(e)
      }
    },
  },

  created: function(){
    this.getGroupMembers()
  }
}
</script>
