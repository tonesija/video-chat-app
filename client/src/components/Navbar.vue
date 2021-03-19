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
</div>

</template>

<script>
    export default {
        data() {
            return {
            }
        }
    }
</script>