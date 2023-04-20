<script>
    import Form from './Form.vue';
    import {router,socket,peer} from "../main"
    import { innerTextAnimate } from '../data';
    import {store} from "../Store"
    import { ref } from 'vue';
    const textAnimation = ref(null)
    export default{
        setup:()=>{
            const coverPage = ref(null)
            const dev = ref(null)
            peer.on('open',id=>{
                window.peerId = id;
            })
            socket.on('connect',()=>{
                console.log('connected');
            })
            socket.on('getRoom',(rooms)=>{
                console.log(rooms);
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
            setInterval(()=>{
                innerTextAnimate(textAnimation.value);
            },16000)
            Notification.requestPermission()
            return {textAnimation,coverPage,dev}
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
                if(!window.peerId) {
                store().setLoading(false)
                return alert("Error Internet connection")
            }
                socket.emit("joinRoom",{username,room,peerId:window.peerId,isJoin})
            },
            handleTheme:(e)=>{
                if(e.target.checked){
                    localStorage.setItem('color-theme','dark')
                    document.documentElement.classList.add('dark');
                }
                else{
                    localStorage.setItem('color-theme','light')
                    document.documentElement.classList.remove('dark');
                }
            },
            clickShow(dev){
                dev.classList.toggle('top-0')
                dev.classList.toggle('z-[-1000]')
                dev.classList.toggle('z-[1000]')
                dev.classList.toggle('opacity-0')
            },
            show(dev){
                dev.classList.remove('opacity-0','top-0')
                dev.classList.add('z-[1000]','opacity-100','top-[40px]')
            },
            hide(dev){
                dev.classList.remove('z-[-1000]','opacity-100','top-[40px]')
                dev.classList.add('opacity-0','top-0','z-[-1000]')
            },
            developer(url){
                window.open(url);
            }
        },
        mounted(){
            if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
                document.querySelector("#checkbox").checked = true
                textAnimation.value.classList.add("text-animate-dark")
            } else {
                document.documentElement.classList.remove('dark')
                document.querySelector("#checkbox").checked = false
                textAnimation.value.classList.remove("text-animate-dark")
            }
            innerTextAnimate(textAnimation.value)
        }
    }
</script>


<template>
    <div ref="coverPage" class="xl:w-[80%] md:w-[90%] w-full mx-auto bg-white dark:bg-slate-700 transition-all duration-1000 lg:px-[100px] md:px-[50px] px-[10px] md:py-[40px] py-[10px] h-full overflow-y-auto">
        <div class="z-10 flex items-center justify-between sm:justify-end md:gap-5 gap-3 w-full py-3 px-[20px]">
            <div class="relative group">
                <div  @mouseover="show(dev)" @mouseout="hide(dev)" class="sm:block hidden  cursor-pointer font-lora text-base font-semibold hover:text-green-600 dark:text-gray-300 capitalize tracking-widest border-2 border-transparent hover:border-b-green-600 transition-all duration-1000 text-gray-600 ">
                    developer
                </div>
                <div @click="clickShow(dev)" class="sm:hidden block cursor-pointer font-lora text-base font-semibold hover:text-green-600 dark:text-gray-300 capitalize tracking-widest border-2 border-transparent hover:border-b-green-600 transition-all duration-1000 text-gray-600 ">
                    developer
                </div>
                <div ref="dev" class="z-[-1000] sm:hover:opacity-100 sm:hover:top-[40px] absolute shadow-md shadow-gray-300 dark:shadow-gray-500 bg-white dark:bg-slate-700 py-[30px] rounded w-[250px] opacity-0 sm:left-[-100%] left-[-50%] top-0 transition-all duration-300 ease-out">
                    <div class="flex justify-center gap-8 ">
                        <span @click="developer('https://www.facebook.com/Horlenggg?mibextid=ZbWKwL')" class="cursor-pointer relative">
                            <p class=" dark:text-gray-300 text-gray-600 text-xs font-lora absolute bottom-[-20px] left-[-10px]">Facebook</p>
                            <svg class="w-[30px] fill-gray-600 dark:fill-gray-300 hover:fill-pink-500 dark:hover:fill-pink-500 transition-all duration-200"
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 512 512">
                            <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/>
                            </svg>
                        </span>
                        <span @click="developer('https://t.me/Horlenggg')" class="relative group cursor-pointer">
                            <p class="dark:text-gray-300 text-gray-600 text-xs font-lora absolute bottom-[-20px] left-[-10px]">Telegram</p>
                            <svg class="w-[30px] fill-gray-600 dark:fill-gray-300 hover:fill-pink-500 dark:hover:fill-pink-500 transition-all duration-200" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 496 512">
                                <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z"/>
                            </svg>
                        </span>
                    </div>
                    <p class="mt-10 dark:text-gray-300 text-gray-600 font-lora text-xs mx-auto w-fit">@Horlenggg</p>
                </div>
            </div>
          <div class="flex items-center gap-2">
            <div class=" switch-btn relative shadow-md shadow-gray-400 dark:shadow-gray-300 rounded-[20px] w-[100px] h-[35px]">
                <input @change="handleTheme" type="checkbox" id="checkbox" class="opacity-0 z-0 absolute">
                <label for="checkbox"></label>
            </div>
            <font-awesome-icon :icon="['faD', 'moon']" size="xl" class="text-gray-400"/>
          </div>
        </div>
        <div class="relative overflow-hidden w-fit mx-auto mt-5">
            <span ref="textAnimation" class="md:text-3xl sm:text-xl text-lg font-lora text-gray-600 dark:text-gray-300 
            before:content-[''] before:absolute transition-all duration-1000 dark:transition-all dark:duration-1000 before:text-white before:bg-white dark:before:bg-slate-700 before:w-full 
            before:h-full before:top-0 before:left-0 before:border-l-2 before:border-gray-700 dark:before:border-gray-300 before:animate-text-animation"></span>
        </div>
        <div class="flex md:flex-row flex-col gap-10 md:gap-5 mt-[50px]">
            <div class="flex-1 flex items-center lg:justify-start sm:justify-center justify-start rounded relative">
                <img src="../assets/Greeting.png" alt="" class="sm:w-auto  w-[250px]">
                <span class="transition-all duration-1000 bg-sky-600 dark:bg-gray-300 dark:text-gray-500 py-1 sm:px-5 px-2 rounded-full absolute text-gray-100 sm:top-[10px] top-[5px] md:right-[-30px] right-[50px] font-lora">Hi Baby</span>
            </div>
            <div class="flex-1 sm:pb-[20px] pb-[200px]">
                <div class="sm:w-[70%] w-[90%] mx-auto">
                    <Form :joinRoom="joinRoom" :coverPage="coverPage"/>
                </div>
            </div>
        </div>
    </div>
</template>


<!-- @click="videoCaller.makeRoom(username,room)"  @click="videoCaller.joinRoom(username,code)" -->


<style>
    input[type="checkbox"] + label{
        cursor: pointer;
        position: relative;
    }
    input[type="checkbox"] + label::before{
        content: 'OFF';
        position: absolute;
        color: #fff;
        background: rgb(195, 195, 195);
        width: 50px;
        height: 25px;
        left: 10px;
        top: 5px;
        text-align: center;
        font-family: 'Lora';
        border-radius: 20px;
        transition: all .3s ease-in-out;
    }
    input[type="checkbox"]:checked + label::before{
        content: 'ON';
        position: absolute;
        left: 40px;
        background: rgb(12, 144, 20);
    }
</style>