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
      
      <v-file-input accept="image/*" color="accent"
        prepend-icon="mdi-file" 
        @change="onNewImage" 
        :error="imgError" :error-messages="errorMsg"
        :success="imgSuccess" :success-messages="successMsg"
        name="img" class="mt-0 pt-0" :show-size="true"
        :rules="rules"
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

      <div class="mt-4"></div>
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
      imgSuccess: false,
      successMsg: null,
      rules: [
        value => !value || value.size < 1*1000*1000 || 
        "Slika treba biti manja od 1 MB!"
      ],

      lightTheme: this.$store.state.lightTheme
    }
  },

  methods: {
    onNewImage(img){
      this.newImage = img
      this.errorMsg = null
      this.imgError = false
      this.successMsg = null
      this.imgSuccess = false
    },

    async sendNewImage(){
      if(!this.newImage){
        this.imgError = true
        this.errorMsg = 'Niste odabrali sliku.'
        return
      }
      const fd = new FormData()
      fd.append('img', this.newImage)
      let token = localStorage.getItem('token')
      fd.append('token', token)

      try {
        let data = (await settings.setNewProfileImg(fd)).data
        this.successMsg = "Nova slika je postavljena."
        this.imgSucess = true

        this.$store.dispatch('changeProfileImg', {
          newImgUrl: data.path
        })
      } catch(e){
        this.imgError = true
        this.errorMsg = 'Slika treba biti manja od 1 MB!'
      }
    },

    changeTheme(){
      this.$store.dispatch('setTheme', {
        theme: this.lightTheme,
        Vuetify: this.$vuetify 
      })
      settings.setTheme({theme: this.lightTheme,
        token: localStorage.getItem('token')})
    }
  },

  created: function(){
    setTimeout(()=>{
      this.lightTheme = this.$store.state.lightTheme
    }, 150)
  }
}
</script>

