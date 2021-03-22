<template>
    <v-container>
            
        <v-row align="center" justify="center">
            <p>Online friends (TODO)</p>

            <v-menu offset-y :close-on-content-click="false"
                rounded="lg">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    color="primary darken-2"
                    v-bind="{attrs: attrs, size: size}"
                    v-on="on"
                    small
                    >
                    Dodaj prijatelja
                    </v-btn>
                </template>
                <v-container class="primary lighten-1">
                    <v-layout row class="py-2 px-2" justify-space-between align-center>
                        <v-flex xs9>
                            <v-text-field class=""
                                dense placeholder="Korisničko ime"
                                single-line v-model="newFriendUsername">

                            </v-text-field>
                        </v-flex>
                        <v-flex xs3>
                            <v-btn icon class="secondary darken-3 ml-3"
                            @click="addFriend">
                                <v-icon color="white">mdi-plus</v-icon>
                            </v-btn>
                        </v-flex>
                            
                    </v-layout>
                    <v-row justify="center">
                        <v-alert
                            transition="fade-transition"
                            border="left"
                            v-show="message"
                            dense
                            :type="alertType"
                            class="caption"
                        >
                            {{ message }}
                        </v-alert>
                    </v-row> 
                    
                </v-container>
            </v-menu>
        </v-row>
    </v-container>

</template>

<script>
import FService from '../services/friendsService'
    export default {
        data() {
            return {
                newFriendUsername: null,
                message: null,
                alertType: null
            }
        },


        computed: {
            size () {
                const size = {xs:'x-small',sm:'small',lg:'large',xl:'x-large'}[this.$vuetify.breakpoint.name];
                return size ? { [size]: true } : {}
            }
        },

        methods: {
            async addFriend(){
                try {
                    let data = (await FService.addFriend({
                        token: localStorage.getItem('token'),
                        otherUsername: this.newFriendUsername
                    })).data
                    this.alertType = 'success'
                    this.message = data.message
                } catch (e){
                    this.alertType = 'error'
                    this.message = e.response.data.message
                }
                setTimeout(() => {
                    this.message = null
                }, 1600)
                console.log(this.$store.state.username + ' dodaje ' + this.newFriendUsername)
            }
        }
    }
</script>