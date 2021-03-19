<template>
  <div class="login">
    <v-container class="my-5">
      <p class="primary--text text--darken-4 display-1">Prijava</p>
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
            required
          ></v-text-field>
        </v-container>
      </v-form>

      <v-container>
            <v-btn
              :disabled="!valid"
              color="primary"
              class="mr-1 ml-2"
              @click="login"
            >
              Prijavi se
            </v-btn>

            <v-btn
              outlined
              color="primary"
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
export default {
  name: 'Login',

  data: ()=> {
    return {
      valid: false,
      username: null,
      password: null,

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

    },

    goToRegister() {
      this.$router.push('/register')
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