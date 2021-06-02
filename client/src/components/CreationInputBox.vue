<template>
  <v-container class="primary lighten-1">
    <v-layout row class="py-2 px-2" justify-space-between align-center>
      <v-flex xs9>
        <v-text-field class=""
            dense :placeholder="placeholder"
            single-line v-model="innerVal">
        </v-text-field>
      </v-flex>
      <v-flex xs3>
          <v-btn icon class="accent ml-3"
          @click="addEvent" fab small>
              <v-icon color="white">mdi-plus</v-icon>
          </v-btn>
      </v-flex>
          
  </v-layout>
  <v-row justify="center">
      <v-alert
          transition="fade-transition"
          border="left"
          v-show="error"
          dense
          :type="errorType"
          class="caption"
      >
          {{ error }}
      </v-alert>
    </v-row> 
  </v-container>
</template>

<script>
export default ({
  data:() => {
    return {
    }
  },

  props: {
    value: String,
    placeholder: String,
    error: String,
    errorType: String
  },

  computed: {
    innerVal: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },

  methods: {
    onPressKey(e) {
      console.log('key press')
      if(e.key === 'Enter'){
        this.addEvent()
      }
    },

    addEvent() {
      this.$emit('add')
    }
  },

  created: function() {
  },

  components: {
  }
})
</script>
