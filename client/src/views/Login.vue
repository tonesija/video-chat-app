<template>
  <div class="login">
    <v-container>
      <p class="secondary--text font-weight-bold display-1">Prijava</p>
      <v-form v-model="valid">
        <v-container>
          <v-text-field
            v-model="username"
            :rules="nameRules"
            label="Korisničko ime"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Lozinka"
            :rules="passwordRules"
            type="password"
            required
          ></v-text-field>
        </v-container>
      </v-form>

      <v-alert
        border="left"
        color="red lighten-2"
        v-show="errorMsg"
        dense
        type="error"
        outlined
      >
        {{ errorMsg }}
      </v-alert>

      <v-container>
            <v-btn
              :disabled="!valid"
              color="accent"
              class="mr-1 ml-2"
              @click="login"
            >
              Prijavi se
            </v-btn>

            <v-btn
              outlined
              color="secondary"
              class=""
              @click="goToRegister"
            >
              Nemaš račun?
            </v-btn>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import authServ from '../services/authenticationService'
export default {
  name: 'Login',

  data: ()=> {
    return {
      valid: false,
      username: null,
      password: null,

      errorMsg: null,

      nameRules: [
        v => !!v || 'Korisničko ime je obavezno'
      ],
      passwordRules: [
        v => !!v || 'Lozinka je obavezna'
      ]
    }
  },

  methods: {
    async login() {
      this.errorMsg = null
      try {
        let data = (await authServ.login({
          username: this.username,
          password: this.password
        })).data
        //postavi korisnika u vuex
        this.$store.dispatch('setUser', {
          creds: {username: data.user.username,
                  email: data.user.email,
                  theme: data.user.theme},
          token: data.token,
          imgPath: data.user.imgPath,
          Vuetify: this.$vuetify
        })
        this.$router.push('/')
      } catch (e) {
        this.errorMsg = e.response.data.message
      }
    },

    goToRegister() {
      this.$router.push('/register')
    }
  },

  components: {
  }
}
</script>