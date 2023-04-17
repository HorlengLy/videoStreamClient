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
            Notification.requestPermission()
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
            show(){
                alert("sorry, it's in comming!")
            }
        }
    }
</script>


<template>
    <div class="mx-auto bg-white lg:px-[100px] md:px-[50px] md:py-[50px] py-[10px] h-full overflow-y-auto">
        <div class=" z-10 flex items-center justify-end w-full py-3 px-[20px]">
          <ul class="flex md:gap-5 gap-2">
            <li @click="show()" class="cursor-pointer font-lora font-semibold hover:text-green-600 border-2 border-transparent hover:border-b-green-600 transition-all duration-100 md:text-base text-gray-600 text-sm">Developer</li>
            <li @click="show()" class="cursor-pointer font-lora font-semibold hover:text-green-600 border-2 border-transparent hover:border-b-green-600 transition-all duration-100 md:text-base text-gray-600 text-sm">DarkMode</li>
          </ul>
        </div>
        <div class="relative overflow-hidden w-fit mx-auto mt-5">
            <span id="text-animate" class="md:text-3xl sm:text-xl text-lg font-lora text-gray-600"></span>
        </div>
        <div class="flex md:flex-row flex-col gap-10 md:gap-5 mt-[50px]">
            <div class="flex-1 flex items-center justify-center rounded relative">
                <img src="https://us.123rf.com/450wm/digitalgenetics/digitalgenetics1502/digitalgenetics150200036/37115314-3d-man-and-vintage-red-phone-on-white-background.jpg" alt="" class="sm:w-auto w-[250px]">
                <span class="bg-sky-600 py-1 sm:px-5 px-2 rounded-full absolute text-gray-100 sm:top-[30px] top-[5px] xl:right-[20px] md:right-[-50px] sm:right-[30px] right-[10px] font-lora">Hi Baby</span>
            </div>
            <div class="flex-1 pb-[50px]">
                <div class="sm:w-[70%] w-[90%] mx-auto">
                    <Form :joinRoom="joinRoom"/>
                </div>
            </div>
        </div>
    </div>
</template>


<!-- @click="videoCaller.makeRoom(username,room)"  @click="videoCaller.joinRoom(username,code)" -->


<style>
    
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