<template>
<div>
    <v-app-bar text app>
        <v-btn text @click="drawer = !drawer">
            <v-icon class="grey--text">mdi-menu</v-icon>
        </v-btn>
        <v-toolbar-title class="text-uppercase grey--text">
            <span class="font-weight-light">
                {{$store.state.username}}
            </span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu offset-y v-if="this.$store.state.isLoggedIn"
            rounded="lg">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                v-bind="attrs"
                v-on="on"
                icon
                >
                <v-icon>mdi-menu</v-icon>
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

        <v-btn color="primary darken-1"
        v-show="!this.$store.state.isLoggedIn"
        router to="/register" v-bind="size">
            <span>Registriraj se</span>
            <v-icon right>mdi-account-arrow-right</v-icon>
        </v-btn>
        <v-btn text color="gray"
        v-show="!this.$store.state.isLoggedIn"
        router to="/login" v-bind="size">
            <span>Prijavi se</span>
            <v-icon right>mdi-login</v-icon>
        </v-btn>
    </v-app-bar>
</div>

</template>

<script>
    export default {
        data() {
            return {
            }
        },


        computed: {
            size () {
                const size = {xs:'x-small',sm:'small',lg:'large',xl:'x-large'}[this.$vuetify.breakpoint.name];
                return size ? { [size]: true } : {}
            }
        },

        methods: {
            signOut(){
                this.$store.dispatch('signOut', {
                    username: this.$store.state.username,
                    email: this.$store.state.email
                })
                setTimeout(()=>location.reload(), 100)
            }
        }
    }
</script>