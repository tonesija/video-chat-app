<template>
    <v-container>
            
        <v-row align="center" justify="center">
            <p>Online friends (TODO)</p>

            <v-menu offset-y :close-on-content-click="false"
                rounded="lg">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                    small
                    >
                    Dodaj prijatelja
                    </v-btn>
                </template>
                <v-container class="primary">
                    <v-layout row class="py-2 px-2" justify-space-between align-center>
                        <v-flex xs9>
                            <v-text-field class="primary lighten-2"
                                dense placeholder="Korisničko ime"
                                rounded single-line v-model="newFriendUsername">

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
                            type="success"
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
    export default {
        data() {
            return {
                newFriendUsername: null,
                message: null
            }
        },

        methods: {
            async addFriend(){
                this.message = 'Zahtjev je poslan.'
                setTimeout(() => {
                    this.message = null
                }, 1600)
                console.log(this.$store.state.username + ' dodaje ' + this.newFriendUsername)
            }
        }
    }
</script>