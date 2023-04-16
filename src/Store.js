import { defineStore } from "pinia"

export const store = defineStore('data',{
    state:()=>({
        loading:false,
        username : "",
        peerId : "",
        rooms:[]
    }),
    actions:{
        setData(username,peerId){
            this.username = username
            this.peerId = peerId
        },
        setRooms(rooms){
            this.rooms = rooms
        },
        setLoading(loading){
            this.loading = loading
        }
    }
})