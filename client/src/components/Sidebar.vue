<template>
    <v-navigation-drawer light v-model="innerVal" 
        app class="primary">
    <v-container>   
        <v-row align="center" justify="center" class="mt-1"
            v-show="$store.state.isLoggedIn">
            <p class="subtitle secondary--text font-weight-bold">Prijatelji</p>
        </v-row>

        <v-row v-show="!$store.state.isLoggedIn"
            align="center" justify="center">
            <p class="subtitle secondary--text">
                <v-btn to="register" class="ma-0 pa-0"
                    plain depressed text>Registrirajte se
                </v-btn> za dodavanje prijatelja
            </p>
        </v-row>

        <v-row v-show="$store.state.isLoggedIn && this.friends.length == 0">
            <p class="subtitle secondary--text">Nemate dodanih prijatelja, dodajte prijatelja dolje</p>
        </v-row>

        <v-row align="center" justify="start" class="pa-0 ma-0"
            v-show="$store.state.isLoggedIn">
            <v-list class="primary pa-0 ma-0" width="100%">
                <v-list-item v-for="f in friends" :key="f.username"
                class="pa-0 ma-0" dense
                router :to="'/chat/'+f.username">
                    <v-list-item-action>
                        <v-icon small>mdi-circle</v-icon>
                    </v-list-item-action>
                    <v-list-item-title class="caption">
                        {{ addThreeDots(f.username, 14) }}
                    </v-list-item-title>
                    <v-icon 
                        v-show="f.newMsgCount"
                        color="accent"
                        fab >
                        mdi-numeric-{{f.newMsgCount}}-circle
                    </v-icon>
                </v-list-item>
            </v-list>
        </v-row>

        <v-row align="center" justify="center" 
            v-show="$store.state.isLoggedIn">
            <v-menu offset-y :close-on-content-click="false"
                rounded="lg">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                    color="accent"
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
                            <v-btn icon class="accent ml-3"
                            @click="addFriend" fab small>
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
    <v-container slot="append">
        <v-row justify="center">
            <p class="text-uppercase secondary--text subtitle">
                    Video<span class="font-weight-light">chat
                </span>
            </p>
        </v-row>
    </v-container>
    </v-navigation-drawer>
</template>

<script>
import FService from '../services/friendsService'
    export default {
        data() {
            return {
                newFriendUsername: null,
                message: null,
                alertType: null,

                friends: []
            }
        },

        props: {
            value: Boolean
        },


        computed: {
            size () {
                const size = {xs:'x-small',sm:'small',lg:'large',xl:'x-large'}[this.$vuetify.breakpoint.name];
                return size ? { [size]: true } : {}
            },

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
            async addFriend(){
                try {
                    let data = (await FService.addFriend({
                        token: localStorage.getItem('token'),
                        otherUsername: this.newFriendUsername
                    })).data
                    this.alertType = 'success'
                    this.message = data.message
                    this.getFriends()
                } catch (e){
                    this.alertType = 'error'
                    this.message = e.response.data.message
                }
                setTimeout(() => {
                    this.message = null
                }, 1600)
                console.log(this.$store.state.username + ' dodaje ' + this.newFriendUsername)
            }, 

            async getFriends(){
                try {
                let data = (await FService.getFriends({
                    token: localStorage.getItem('token')
                })).data
                    this.friends = data.friends
                } catch(e){
                    console.log(e)
                }
            },

            addThreeDots(text, chars){
                if(text.length > chars){
                    text = text.substring(0, chars) + '...'
                }
                return text
            }
        },

        sockets: {
            newMessage: async function(msg) {
                let from = msg.user1.username
                if(this.$route.params.username === from) return

                for(let i = 0; i < this.friends.length; ++i){
                    if(this.friends[i].username === from){
                        let tmp = this.friends[i]
                        if(tmp.newMsgCount)
                            tmp.newMsgCount++
                        else 
                            tmp.newMsgCount = 1
                        this.$set(this.friends, i, tmp)
                        break
                    }
                }
            },
            newFriend: async function() {
                this.getFriends()
            },
            loggedIn: async function() {
                this.getFriends()
            }
        },

        created: function() {
        },


        //on route change
        watch:{
            $route (to, from){
                console.log('route changed',to , from)

                if(to.params.username){
                    let username = to.params.username
                    for(let i = 0; i < this.friends.length; ++i){
                        if(this.friends[i].username === username){
                            let tmp = this.friends[i]
                            tmp.newMsgCount = null
                            this.$set(this.friends, i, tmp)
                            break
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .text-overflow-dots{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width:100px; 
    }

    p{
        text-align: center;
    }
</style>