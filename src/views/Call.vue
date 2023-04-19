<script setup>
    import { ref,onMounted,watch } from "vue";
    import { socket,peer } from "../main";
    import {reerConstrain,frontConstrain} from "../data"
    import { store } from "../Store";
    const reerCamera = ref(false)
    const screenShare = ref(false)
    const localStream = ref(null)
    const ownVideoStream = ref(null)
    // event
    peer.on('connection',(conn)=>{
        window.friendId = conn.peer;
    })
    socket.on('userJoinedRoom',({username,peerId})=>{
        peer.connect(peerId)
        pushNoti(`${username} join room`)
        if(window.screen.width<500)
            alert(`${username} join room`)
    })
    socket.on("user-left",peerId=>{
        document.getElementById(peerId)?.remove()
        pushNoti(`${getUser(peerId)?.username} was left the room`)
        if(window.screen.width<500)
            alert(`${username} join room`)
    })
    peer.on('call',async(call)=>{
        call.answer(localStream.value)
        call.on('stream',stream=>{
            addStream(getUser(window.friendId)?.username,window.friendId,stream)
        })
    })

    onMounted(async function(){
        await navigator.mediaDevices.getUserMedia(frontConstrain)
        .then(remoteStreem=>{
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
                    call.on('stream',stream=>{
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

    async function switchCamera(){
        closeCamera()
        if(reerCamera){
            try{
                await navigator.mediaDevices.getUserMedia(reerConstrain)
                .then(async(remoteStream)=>{
                    localStream.value = remoteStream
                    ownVideoStream.value.srcObject = remoteStream;
                    ownVideoStream.value.addEventListener('loadedmetadata',()=>{
                        ownVideoStream.value.play();
                    })
                    const members = store().rooms?.members
                    members?.forEach(async(member)=>{
                        peer.connect(member.peerId)
                        if(member.peerId == store().peerId) return
                        const call = peer.call(member.peerId,remoteStream)
                        call.on('stream',stream=>{
                            addStream(member.username,member.peerId,stream)
                        })
                    })
                    reerCamera.value = !reerCamera.value
                })
            }catch(err){
                console.log(err)
            }
        }
        else{
            try{
                await navigator.mediaDevices.getUserMedia(frontConstrain)
                .then((remoteStream)=>{
                    localStream.value = remoteStream
                    ownVideoStream.value.srcObject = remoteStream;
                    ownVideoStream.value.addEventListener('loadedmetadata',()=>{
                        ownVideoStream.value.play();
                    })
                    const members = store().rooms?.members
                    members?.forEach((member)=>{
                        peer.connect(member.peerId)
                        if(member.peerId == store().peerId) return
                        const call = peer.call(member.peerId,remoteStream)
                        call.on('stream',stream=>{
                            addStream(member.username,member.peerId,stream)
                        })
                    })
                    reerCamera.value = !reerCamera.value
                })
            }catch(err){
                console.log(err)
            }
        }
        
        screenShare.value = false
    }

   async function shareScreen(){
       try{
            await navigator.mediaDevices.getDisplayMedia({video:true,audio:true})
            .then(remoteStream=>{
                closeCamera()
                localStream.value = remoteStream
                ownVideoStream.value.srcObject = remoteStream;
                ownVideoStream.value.addEventListener('loadedmetadata',()=>{
                    ownVideoStream.value.play();
                })
                const members = store().rooms?.members
                members?.forEach((member)=>{
                    peer.connect(member.peerId)
                    if(member.peerId == store().peerId) return
                    const call = peer.call(member.peerId,remoteStream)
                    call.on('stream',stream=>{
                        addStream(member.username,member.peerId,stream)
                    })
                })
                screenShare.value = true
            })
        }catch(err){
            console.log(err);
        }
    }

    function closeCamera(){
        if(localStream.value) {
            const tracks = localStream.value.getTracks()
            tracks.forEach(track=>track.stop())
        }
    }

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
    <div class="w-full mx-auto transition-all duration-1000 h-full bg-white dark:bg-slate-700">
        <div id="call-container" class="lg:grid xl:grid-cols-3 lg:grid-cols-2 py-10  md:px-10 overflow-y-auto w-full h-[80%] bg-gray-200 dark:bg-gray-600">
            <div class="videoCover z-0">
                <video  ref="ownVideoStream" muted></video> 
                <span class="username self">You</span>
            </div>
        </div>

        <div class="absolute w-fit left-0 right-0 h-[20%] mx-auto py-[20px]">
            <div class="inline-block">
                <span @click="switchCamera()" class="cursor-pointer p-4 sm:hidden block">
                    <button class="py-2 px-4 text-gray-500 transition-all duration-200 hover:text-gray-100 dark:hover:text-gray-100 hover:bg-[#17801c] dark:hover:bg-[#17801c] bg-[#b9d7d9] dark:text-gray-200 dark:bg-[#668284] rounded-md">switch camera</button>
                </span>
                <span  v-if="!screenShare" @click="shareScreen()" class="cursor-pointer p-4 sm:block hidden">
                    <button class="py-2 px-4 text-gray-500 transition-all duration-200 hover:text-gray-100 dark:hover:text-gray-100 hover:bg-[#17801c] dark:hover:bg-[#17801c] bg-[#b9d7d9] dark:text-gray-200 dark:bg-[#668284] rounded-md">share screen</button>
                </span>
                <span v-else @click="switchCamera()" class="cursor-pointer p-4 sm:block hidden">
                    <button class="py-2 px-4 text-gray-500 transition-all duration-200 hover:text-gray-100 dark:hover:text-gray-100 hover:bg-[#17801c] dark:hover:bg-[#17801c] bg-[#b9d7d9] dark:text-gray-200 dark:bg-[#668284] rounded-md">open camera</button>
                </span>
            </div>
            <button @click="leave()" class=" cursor-pointer font-lora px-[20px] rounded-md bg-red-700 dark:hover:bg-red-500 hover:bg-red-500 dark:bg-red-700 dark:text-white text-white py-2 transition-all duration-200 md:text-base text-sm">Leave</button>
        </div>
    </div>
</template>



<style>
    .videoCover{
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: stretch;
        width: 100%;
        overflow: hidden;
        height: 400px;
        border-radius: 5px;
        background: #000;
    }  
    .videoCover video{
        border-radius: 5px;
        width: 100%;
        height: 100%;
    }
    .username{
        position: absolute;
        z-index: 100;
        color: #91b503;
        font-size: 25px;
        font-family: Lora;
        width: fit-content;
        font-weight: bold;
        text-transform: capitalize;
        bottom: 10px;
        left: 0;
        right: 0;
        margin: auto;
    }
    .self{
        color: #21a42c;
    }
    .owner{
        color: #aeea00;
    }
    .owner::after{
        content: '(Owner)';
    }
    @media screen and (max-width:1000px){
        .videoCover{
            width: 98%;
            height: auto;
            margin: auto;
            border-radius: 5px;
            margin-top: 10px;
        }
        video{
            border-radius: 5px;
        }
        .username{
            font-size: 15px;
            bottom: 10px;   
            left: 0;
            right: 0;
            margin: auto;
        }
    }
</style>