<template>
<div>
    <v-app-bar class="secondary" app>
        <div class="relative">
            <v-btn @click="openCloseDrawer" fab small class="accent">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
            <div class="top-right" v-show="newMsgs">
                <v-icon color="accent lighten-3" 
                    >
                    mdi-numeric-{{newMsgs}}-circle</v-icon>
            </div>
        </div>
        <v-toolbar-title class="text-uppercase primary--text ml-3"
            style="cursor: pointer" @click="$router.push('/').catch(()=>{})">
            Video<span class="font-weight-light">chat</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-avatar size="40" class="mr-2">
            <img v-if="$store.state.imgPath"
                :src="`${baseUrl}${$store.state.imgPath}`"/>
        </v-avatar>
        <v-toolbar-title class="primary--text font-weight-light mr-1">
            <span>
                {{$store.state.username}}
            </span>
        </v-toolbar-title>

        <NotificationMenu></NotificationMenu>
        
        <v-menu offset-y v-if="this.$store.state.isLoggedIn"
            rounded="lg">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs" v-on="on"
                    icon large color="accent">
                    <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-item router to="/settings">
                    <v-list-item-action>
                        <v-icon>mdi-cog</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                        Postavke
                    </v-list-item-title>
                </v-list-item>

                <v-list-item @click="signOut" router to='/'>
                    <v-list-item-action>
                        <v-icon>mdi-logout</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>
                        Odjavi se
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-btn color="accent"
        v-show="!this.$store.state.isLoggedIn"
        router to="/register" v-bind="size">
            <span>Registriraj se</span>
            <v-icon right>mdi-account-arrow-right</v-icon>
        </v-btn>
        <v-btn text color="primary"
        v-show="!this.$store.state.isLoggedIn"
        router to="/login" v-bind="size">
            <span>Prijavi se</span>
            <v-icon right>mdi-login</v-icon>
        </v-btn>
    </v-app-bar>
    <Sidebar v-model="drawer"></Sidebar>
</div>

</template>

<script>
import Sidebar from '../components/Sidebar'
import NotificationMenu from '../components/NotificationMenu'

    export default {
        data() {
            return {
                drawer: false,

                newMsgs: 0
            }
        },


        computed: {
            size () {
                const size = {xs:'x-small',sm:'small',lg:'large',xl:'x-large'}[this.$vuetify.breakpoint.name];
                return size ? { [size]: true } : {}
            },

            baseUrl () {
                return process.env.VUE_APP_ENV_BASE_URL
            }
        },

        methods: {
            signOut(){
                this.$store.dispatch('signOut', {
                    username: this.$store.state.username,
                    email: this.$store.state.email
                })
                setTimeout(()=>location.reload(), 100)
            },
            openCloseDrawer(){
                this.drawer = !this.drawer
                if(this.drawer)
                    this.newMsgs = 0
            }
        },

        sockets: {
            newMessage: async function(msg) {
                let from = msg.user1.username
                if(this.$route.params.username == from ||
                this.$store.state.username == from) return
                this.newMsgs++
            }
        },

        components: {
            Sidebar,
            NotificationMenu
        }
    }
</script>

<style scoped>
    .relative{
        position: relative;
    } 
    .top-right{
        position: absolute;
        top: -0.4rem;
        right: -0.7rem;
    }
</style>