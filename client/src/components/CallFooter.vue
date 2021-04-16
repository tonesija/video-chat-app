<template>
  <div class="d-flex flex-row justify-space-around">
    <div class="align-self-end">
      <v-btn icon x-large @click="micSwitch">
        <v-icon x-large color="secondary">{{microphone}}</v-icon>
      </v-btn>
    </div>

    <div>
      <v-btn icon x-large @click="hangUp()">
        <v-icon x-large color="error">mdi-phone-hangup</v-icon>
      </v-btn>
    </div>

    <div>
      <v-btn icon x-large @click="cameraSwitch">
        <v-icon x-large color="secondary">{{camera}}</v-icon>
      </v-btn>
    </div>

  </div>
</template>
<script>

export default {
  data:()=>{
    return {
      micOn: true,
      cameraOn: false
    }
  },

  methods: {
    hangUp() {
      this.$emit('hangUp')
    },

    micSwitch() {
      this.micOn = !this.micOn
      this.$emit('micSwitch', this.micOn)
    },

    cameraSwitch() {
      this.cameraOn = !this.cameraOn
      this.$emit('cameraSwitch', this.cameraOn)
    }
  },

  computed: {
    camera() {
      return this.cameraOn ? 'mdi-webcam' : 'mdi-webcam-off'
    },
    microphone() {
      return this.micOn ? 'mdi-microphone' : 'mdi-microphone-off'
    }
  }
}
</script>
