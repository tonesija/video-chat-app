<template>
  <v-text-field v-model="innerVal" class=""
    filled shaped height="75" dense @keydown="onPressKey">
    <v-menu slot="append" offset-y
      :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            v-bind="attrs"
            v-on="on"
            icon x-large
            color="accent">
          <v-icon large>mdi-emoticon-happy-outline</v-icon>
        </v-btn>
      </template>
      <v-container class="ma-0 pa-0">
        <VEmojiPicker slot="append-outer" 
          @select="selectEmoji"
          :continuousList="true"/>
      </v-container>
    </v-menu>
    
    <v-btn slot="append-outer"  @click="sendMessage" 
      color="accent" fab>
      <v-icon>mdi-send</v-icon>
    </v-btn>
  </v-text-field>

</template>

<script>
import { VEmojiPicker } from 'v-emoji-picker';

export default ({
  data:() => {
    return {
    }
  },

  props: {
    value: String
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
      if(e.key === 'Enter'){
        this.sendMessage()
      }
    },

    sendMessage() {
      this.$emit('messageSent')
    },

    selectEmoji(emoji) {
      if(this.innerVal)
        this.innerVal += emoji.data
      else
        this.innerVal = emoji.data
    }
  },

  created: function() {
  },

  components: {
    VEmojiPicker
  }
})
</script>
