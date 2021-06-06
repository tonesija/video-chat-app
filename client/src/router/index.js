import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import VideoChat from '../views/VideoChat.vue'
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
    path: '/rooms',
    name: 'Home',
    component: Home
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
    path: '/video-chat',
    name: 'VideoChatTest',
    component: VideoChat
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
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
