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
                        <div class="relative">
                            <v-avatar size="32" v-if="f.imgPath">
                                <img v-if="f.imgPath" 
                                    :src="`${baseUrl}${f.imgPath}`"/>
                            </v-avatar>
                            <v-avatar size="32" v-if="!f.imgPath"
                                color="secondary">
                            </v-avatar>
                            <div class="bottom-right">
                                <v-icon :class="{'online--text': f.status,
                                        'offline--text': !f.status}"
                                small
                                >mdi-circle</v-icon>
                            </div>
                        </div>
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
            <CreationInput :title="'Dodaj prijatelja'"
                :placeholder="'Korisničko ime'" @add="addFriend"
                v-model="newFriendUsername" :errorType="alertType"
                :error="message"></CreationInput>
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
    <Groups v-show="$store.state.isLoggedIn"></Groups>
    </v-navigation-drawer>
</template>

<script>
import FService from '../services/friendsService'
import Groups from './Groups'
import CreationInput from './CreationInput'
    export default {
        data() {
            return {
                newFriendUsername: null,
                message: null,
                alertType: null,

                friends: [],
                friendsSet: null
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
            },

            baseUrl () {
                return process.env.VUE_APP_ENV_BASE_URL
            }
        },

        methods: {
            async addFriend(){
                try {
                    let data = (await FService.sendFriendRequest(this.newFriendUsername)).data
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
            }, 

            async getFriends(){
                try {
                    let data = (await FService.getFriends({
                        token: localStorage.getItem('token')
                    })).data
                    this.friends = data.friends
                    this.friendsSet = new Set()
                    for(let f of this.friends)
                        this.friendsSet.add(f.username)
                    this.askFriendsForStatus()
                } catch(e){
                    console.log(e)
                }
            },

            addThreeDots(text, chars){
                if(text.length > chars){
                    text = text.substring(0, chars) + '...'
                }
                return text
            },

            askFriendsForStatus(){
                console.log("asking")
                for(let f of this.friends){
                    console.log("asking", f.username)
                    this.$socket.client.emit('get-status', {username: f.username})
                }
            },

            setFriendStatus(username, status){
                if(!this.friendsSet) return
                if(!this.friendsSet.has(username))
                    return
                let i
                for(i = 0; i < this.friends.length; ++i){
                    if (this.friends[i].username === username)
                        break
                }
                let friend = this.friends[i]
                friend.status = status
                this.$set(this.friends, i, friend)
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
            },
            status: async function({username, status}){
                console.log('got status', username, status)
                this.setFriendStatus(username, status)
            }
        },

        //on route change
        watch:{
            $route (to, from){
                console.log('route changed',to , from)
                
                //izbrisi brojac neprocitanih poruka na stranici tog prijatelja
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

                //ako korisnik nije registriran usmjeri ga
                if(to.fullPath != "/login" && 
                    to.fullPath != "/register" && to.fullPath != "/"){
                    if(!this.$store.state.isLoggedIn)
                        this.$router.push("/register")
                }
            }
        },
        components:{
            Groups,
            CreationInput
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

    .relative{
        position: relative;
    } 
    .bottom-right{
        position: absolute;
        top: 1.1rem;
        right: -0.35rem;
    }
</style>