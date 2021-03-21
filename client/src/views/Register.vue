<template>
  <div class="register">
    <v-container>
      <p class="primary--text text--darken-4 display-1">Registracija</p>
      <v-form v-model="valid">
        <v-container>
          <v-text-field
            v-model="username"
            :rules="nameRules"
            label="Korisničko ime"
            required
          ></v-text-field>

          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            type="password"
            label="Lozinka"
            :rules="passwordRules"
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
          color="primary"
          class="ml-2 mr-1"
          @click="register"
        >
          Registriraj se
        </v-btn>

        <v-btn
          outlined
          color="primary"
          class=""
          @click="goToLogin"
        >
          Već imaš račun?
        </v-btn>
      </v-container>
    </v-container>
  </div>


</template>

<script>
import authServ from '../services/authenticationService'
export default {
  name: 'Register',

  data: ()=> {
    return {
      valid: false,
      username: null,
      email: null,
      password: null,

      errorMsg: null,

      nameRules: [
        v => !!v || 'Korisničko ime je obavezno'
      ],

      emailRules: [
        v => !!v || 'E-mail je obavezan',
        v => /.+@.+/.test(v) || 'E-mail mora biti ispravan',
      ],

      passwordRules: [
        v => !!v || 'Lozinka je obavezna'
      ]
    }
  },

  methods: {
    async register() {
      this.errorMsg = null
      try {
        let data = (await authServ.register({
          username: this.username,
          email: this.email,
          password: this.password
        })).data

        //postavi korisnika u vuex
        this.$store.dispatch('setUser', {
          creds: {username: data.user.username,
          email: data.user.email},
          token: data.token
        })

        //spremi token u browser
      } catch (e) {
        this.errorMsg = e.response.data.message
      }
    },

    goToLogin() {
      this.$router.push('/login')
    }
  },

  created: function() {
  },

  destroyed: function() {
  },

  components: {
  }
}
</script>

<style scoped>

</style>