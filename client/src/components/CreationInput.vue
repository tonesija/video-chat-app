<template>
  <v-menu offset-y :close-on-content-click="false"
    rounded="lg">
    <template v-slot:activator="{on, attrs}">
        <v-btn
        color="accent"
        v-bind="{attrs: attrs}"
        v-on="on"
        small
        >
        {{title}}
        </v-btn>
    </template>
    <CreationInputBox v-model="innerVal"
      :placeholder="placeholder" :error="error"
      :errorType="errorType"
      @add="addEvent"></CreationInputBox>
  </v-menu>


</template>

<script>
import CreationInputBox from './CreationInputBox'
export default ({
  data:() => {
    return {
    }
  },

  props: {
    value: String,
    title: String,
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
    CreationInputBox
  }
})
</script>
