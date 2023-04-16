<script>
    import Form from './Form.vue';
    import {router,socket,peer} from "../main"
    import { innerTextAnimate } from '../data';
    import {store} from "../Store"
    peer.on('open',id=>{
        window.peerId = id;
        console.log(id)
    })
    socket.on('connect',()=>{
        console.log('connection');
    })
    socket.on('getRoom',(rooms)=>{
        // console.log({rooms});
        store().setRooms(rooms)
    })
    socket.on('response',({ms,room,success})=>{
        store().setLoading(false)
        if(success) {
            socket.emit("getRooms",room);
            return router.replace({path:'/call/'+room})
        }
        alert(ms)
    })
    export default{
        setup:()=>{
            setTimeout(()=>innerTextAnimate())
            setInterval(()=>{
                innerTextAnimate();
            },16000)
            return {}
        },
        components:{Form},
        methods:{
            joinRoom:(username,room,isJoin)=>{
                store().setLoading(true)
                store().setData(username,window.peerId)
                if(!username || !room) {
                    store().setLoading(false)
                    return alert('all field are required')
                }
                if(!window.peerId) return alert("Error Internet connection")
                socket.emit("joinRoom",{username,room,peerId:window.peerId,isJoin})
            },
        }
    }
</script>


<template>
    <div class="lg:w-[80%] mx-auto bg-white py-[100px] h-full">
        <div class="relative overflow-hidden w-fit mx-auto">
            <span id="text-animate" class="md:text-3xl sm:text-xl text-lg font-lora font-bold text-gray-600"></span>
        </div>
        <div class="flex md:flex-row flex-col gap-10 md:gap-5 mt-[50px]">
            <div class="flex-1 flex items-center justify-center rounded relative">
                <img src="https://us.123rf.com/450wm/digitalgenetics/digitalgenetics1502/digitalgenetics150200036/37115314-3d-man-and-vintage-red-phone-on-white-background.jpg" alt="" class="sm:w-auto w-[250px]">
                <span class="bg-sky-600 py-1 sm:px-5 px-2 rounded-full absolute text-gray-100 top-[30px] right-[20px] font-lora">Hi Baby</span>
            </div>
            <div class="flex-1">
                <div class="sm:w-[70%] w-[90%] mx-auto">
                    <Form :joinRoom="joinRoom"/>
                </div>
            </div>
        </div>
    </div>
</template>


<!-- @click="videoCaller.makeRoom(username,room)"  @click="videoCaller.joinRoom(username,code)" -->


<style>
    label{
        position: absolute;
        transition: top .2s ease-out;
        left: 20px;
        top: 12px;
    }
    input:focus + label,input:valid + label,#room + label{
        top: -10px;
        background: #fff;
        color: green;
    }
    #text-animate::before{
        content: '';
        position: absolute;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
        border-left: 2px solid orange;
        background: #fff;
        animation: text-animate 4s steps(10) infinite;
    }
    @keyframes text-animate{
        40%,60%{
            left: 100%;
        }
        80%,100%{
            left: 0;
        }
    }
</style>