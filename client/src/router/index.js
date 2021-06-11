import Vue from 'vue'
import VueRouter from 'vue-router'
import GroupCall from '../views/GroupCall.vue'
import Register from '../views/Register'
import Login from '../views/Login'
import Index from '../views/Index.vue'
import Chat from '../views/Chat.vue'
import Call from '../views/Call.vue'
import Settings from '../views/Settings.vue'
import Group from '../views/Group.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/chat/:username',
    name: 'Chat',
    component: Chat
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/call/:username',
    name: 'Call',
    component: Call
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/group-call/:groupId',
    name: 'GroupCall',
    component: GroupCall
  },
  {
    path: '/group/:groupName',
    name: 'Group',
    component: Group
  }
]

const router = new VueRouter({
  routes
})

export default router
