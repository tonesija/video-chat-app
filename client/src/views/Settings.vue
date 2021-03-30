<template>
  <div class="settings">
    <v-container>
      <p class="secondary--text font-weight-bold display-1"
        ><span><v-icon color="secondary" class="mr-3" large>
          mdi-cog</v-icon></span>Postavke</p>
      

      <p v-show="$store.state.imgPath" 
        class="mb-0 secondary--text font-weight-light">Promijeni profilnu</p>
      <p v-show="!$store.state.imgPath"
        class="mb-0 secondary--text font-weight-light">Postavi profilnu</p>
      <v-file-input accept="image/*"
        prepend-icon="mdi-file"
        @change="onNewImage"
        :error="imgError" :error-messages="errorMsg"
        name="img"  class="mt-0 pt-0"
        >
        <template slot="append-outer">
          <v-btn icon @click="sendNewImage"
            large>
            <v-icon color="accent">
              mdi-send
            </v-icon>
          </v-btn>
        </template>
      </v-file-input>

      <p v-show="lightTheme" 
        class="mb-0 secondary--text font-weight-light">Svijetla tema</p>
      <p v-show="!lightTheme"
        class="mb-0 secondary--text font-weight-light">Tamna tema(todo)</p>
      <v-switch v-model="lightTheme"
        @change="changeTheme" class="ma-0">
      </v-switch>

    </v-container>
  </div>
</template>

<script>
import settings from '../services/settingsService'
export default {
  data() {
    return {
      newImage: null,
      imgError: false,
      errorMsg: null,

      lightTheme: true
    }
  },

  methods: {
    onNewImage(img){
      this.newImage = img
      this.errorMsg = null
      this.imgError = false
      console.log(img)
    },

    async sendNewImage(){
      console.log('Setting new image')
      if(!this.newImage){
        this.imgError = true
        this.errorMsg = 'Niste odabrali sliku.'
        return
      }
      const fd = new FormData()
      fd.append('img', this.newImage)
      let token = localStorage.getItem('token')
      fd.append('token', token)
      console.log(fd)

      let data = (await settings.setNewProfileImg(fd)).data

      this.$store.dispatch('changeProfileImg', {
        newImgUrl: data.path
      })
    
      console.log(data)
    },

    changeTheme(){
      this.$store.dispatch('setTheme', {
        lightTheme: this.lightTheme,
        Vuetify: this.$vuetify 
      })
    }
  }
}
</script>

