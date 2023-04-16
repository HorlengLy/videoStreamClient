import { createApp } from 'vue'
import "./assets/main.css"
import App from './App.vue'
import {Peer} from "peerjs"
import { io } from 'socket.io-client'
import {createWebHistory,createRouter} from 'vue-router'
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from 'pinia'
export const socket = io("https://call-video.onrender.com",{transports: ['websocket', 'polling', 'flashsocket']});
export const peer = new Peer()

const pinia = createPinia()

const routes = [
    {
        path:'/',
        name:'home',
        component: ()=>import("@/views/Home.vue"),
    },
    {
        path:'/call/:room',
        name:'call',
        component: ()=>import("@/views/Call.vue"),
    },
    {
        path:'/:pathMatch(.*)*',
        name:'notFoundPage',
        component: ()=>import("@/views/PageNotFound.vue"),
    },
] 


export const router = createRouter({
    history:createWebHistory(),
    routes
})
library.add(fas);


const app = createApp(App)
app.use(pinia)
app.use(router)
app.component("font-awesome-icon", FontAwesomeIcon)
app.mount('#app')
