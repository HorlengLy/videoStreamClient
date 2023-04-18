<script setup>
    import { ref,onMounted,watch } from "vue";
    import { socket,peer } from "../main";
    import { store } from "../Store";
    // const reerCamera = ref(false)
    // const shareScreen = ref(false)
    const localStream = ref(null)
    const ownVideoStream = ref(null)
    const friendStream = ref([])
    // event
    peer.on('connection',(conn)=>{
        window.friendId = conn.peer;
    })
    socket.on('userJoinedRoom',({username,peerId})=>{
        peer.connect(peerId)
        pushNoti(`${username} join room`)
        // callFriend(peerId,getUser(peerId)?.username)
    })
    socket.on("user-left",peerId=>{
        document.getElementById(peerId)?.remove()
        pushNoti(`${getUser(peerId)?.username} was left the room`)
    })
    socket.on('screenChenged',async(peerId)=>{
        peer.connect(peerId)
        const call = peer.call(peerId,window.localStream)
        call.on("stream",friendStream=>{
            const video = document.getElementsByClassName(peerId)[0]
            if(!video) return
            video.srcObject = friendStream
            video.addEventListener('loadedmetadata',()=>{
                video.play()
            })
        })
    })
    peer.on('call',async(call)=>{
        call.answer(localStream.value)
        call.on('stream',stream=>{
            addStream(getUser(window.friendId)?.username,window.friendId,stream)
        })
    })

    onMounted(async function(){
        await navigator.mediaDevices.getUserMedia({
                video:true,audio:true,
            }).then(remoteStreem=>{
                localStream.value = remoteStreem
                ownVideoStream.value.srcObject = remoteStreem;
                ownVideoStream.value.addEventListener('loadedmetadata',()=>{
                    ownVideoStream.value.play();
                })
                const members = store().rooms?.members
                members?.forEach(async(member)=>{
                    peer.connect(member.peerId)
                    if(member.peerId == store().peerId) return
                    const call = peer.call(member.peerId,remoteStreem)
                    await call.on('stream',stream=>{
                        addStream(member.username,member.peerId,stream)
                    })
                })
            })
    })
    function leave(){
        window.location.href = "https://videocaller.netlify.app/";
    }
    function getUser(peerId){
        return store().rooms?.members?.find(member=>member.peerId===peerId)
    }



    // funtion


    function pushNoti(ms){
        const notification = new Notification("Video Caller",{
            icon:"https://play-lh.googleusercontent.com/DeFtrBbTyGbOhe8Z7cfHa1fzeVuLPRP2kAVkLJ2igIK3gC-yQ-df8eJGC4zY-gpJ2Q",
            body:ms
        })
        setTimeout(()=>{
            notification.close();
        },5000)

    }
    
    function addStream(name,peerId,stream){
        console.log({peerId,name});
        const data = document.getElementsByClassName(peerId)[0]
        if(data) {
            data.srcObject = stream
            data.addEventListener('loadedmetadata',()=>{
                data.play();
            })
            return
        }
        const video = document.createElement("video")
        const span = document.createElement("span")
        const div = document.createElement("div")
        div.classList.add("videoCover")
        span.textContent = name
        if(isOwner(peerId))
            span.classList.add('owner')
        span.classList.add("username")
        div.setAttribute("id",peerId)
        video.setAttribute('class',peerId)
        video.srcObject = stream;
        video.addEventListener("loadedmetadata",()=>{
            video.play()
        })
        div.append(video)
        div.append(span)
        document.querySelector("#call-container").append(div);
    }
    function isOwner(peerId){
        const room = store().rooms
        const user = room?.members?.find(mem=>mem.peerId === peerId)
        if(!user) return false
        return user.socketId == room.owner;
        
    }
</script>
<template>
    <div class="xl:w-[80%] md:w-[90%] w-full mx-auto transition-all duration-1000 lg:py-[30px] py-[20px]  h-full overflow-y-auto bg-white dark:bg-slate-700">
        <div class=" z-10 flex items-center justify-end w-full py-3 px-[20px]">
            <button @click="leave()" class=" cursor-pointer font-lora border border-red-600 dark:border-gray-400 dark:hover:bg-gray-800 px-[20px] rounded-md hover:bg-red-600 hover:text-white py-2 transition-all duration-1000 md:text-base text-gray-600 dark:text-gray-200 text-sm">Leave</button>
        </div>
        <div id="call-container" class="lg:grid lg:grid-cols-2 w-full mt-1 pb-[20px]">
            <div class="videoCover z-0">
                <video  ref="ownVideoStream"  src="" muted></video> 
                <span class="username self">You</span>
                <!-- <span @click="phoneCamera(false)" class="absolute left-0 right-0 mx-auto w-fit bottom-5 cursor-pointer p-4 md:hidden block">
                    <font-awesome-icon :icon="['fas', 'camera-rotate']" size="xl" class="text-gray-400"/>
                </span> -->
                <!-- <span @click="openStream(false)" class="absolute left-0 right-0 mx-auto w-fit bottom-10 cursor-pointer p-4 md:block hidden">
                    <font-awesome-icon :icon="['fas', 'desktop']" size="xl" class="text-gray-400" v-if="shareScreen"/>
                    <font-awesome-icon :icon="['fas', 'camera']" size="xl" class="text-gray-400" v-else/>
                </span> -->
            </div>
        </div>
    </div>
</template>



<style>
    .videoCover{
        position: relative;
        border-radius: 5px;
        padding: 10px;
        width: 100%;
        overflow: hidden;
        height: auto;
        border-radius: 10px;
    }  
    .videoCover video{
        width: 100%;
        height: 100%;
        border-radius: 10px;
    }
    .username{
        position: absolute;
        z-index: 100;
        color: red;
        font-size: 20px;
        font-family: Lora;
        width: fit-content;
        left: 0;
        right: 0;
        margin: auto;
        bottom: 30px;
    }
    .self{
        color: gold;
        bottom: 20px;
    }
    .owner{
        color: orange;
    }
    .owner::after{
        content: '  =>Owner';
    }
    @media screen and (max-width:1000px){
        .videoCover{
            width: 98%;
            height: auto;
            margin: auto;
            border-radius: 10px;
        }
        .videoCover video{
            border-radius: 10px;
        }
    }
</style>