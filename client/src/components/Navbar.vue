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
        <v-btn text color="gray">
            <span>Sign out</span>
            <v-icon right>mdi-logout</v-icon>
        </v-btn>
    </v-app-bar>

    <v-navigation-drawer light v-model="drawer" app class="primary">
        <v-list>
            <v-list-item router to="/about">
                <v-list-item-action>
                    <v-icon color="white">mdi-view-dashboard</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title class="white--text">
                        Dashboard
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list> 
    </v-navigation-drawer>
</div>

</template>

<script>
    export default {
        data() {
            return {
                drawer: false
            }
        }
    }
</script>