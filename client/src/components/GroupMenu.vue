<template>
  <v-container>   
    <v-row align="center" justify="center" >
      <v-menu offset-y :close-on-content-click="false"
          rounded="lg">
        <template v-slot:activator="{on, attrs}">
            <v-btn color="accent"
            v-bind="{attrs: attrs}" v-on="on" small>
            GroupMenu
            </v-btn>
        </template>
        <v-container class="pa-0 ma-0">
          <v-list class="primary" width="100%">
            <v-list-item v-show="group.creatorId == userId">
                <v-menu offset-x left :close-on-content-click="false">
                  <template v-slot:activator="{on, attrs}">
                    <v-btn color="secondary" depressed
                      v-bind="{attrs: attrs}" v-on="on" small>
                      Pozovi člana
                    </v-btn>
                  </template>
                  <h1>inv member go here</h1>
                </v-menu>
            </v-list-item>
            <v-list-item v-show="group.creatorId == userId">
              <v-btn color="secondary" depressed small
                @click="deleteGroup">
                Izbriši grupu
              </v-btn>
            </v-list-item>
            <v-list-item v-show="group.creatorId != userId">
              <v-btn color="secondary" depressed small>
                Izađi iz grupe
              </v-btn>
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
      userId: null
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
    }
  },

  created: function(){
    this.userId = this.$store.state.id
  }
}
</script>
