<script setup>
    import { ref,onMounted } from "vue";
    import { socket,peer } from "../main";
    import { store } from "../Store";
    const reerCamera = ref(false)
    const shareScreen = ref(false)
    peer.on('connection',(conn)=>{
        window.friendId = conn.peer;
    })
    socket.on('userJoinedRoom',({username,peerId})=>{
        peer.connect(peerId)
        const call = peer.call(peerId,window.localStream)
        call.on("stream",friendStream=>{
            addStream(username,peerId,friendStream)
        })
        pushNoti(`${username} join room`)
    })
    socket.on("user-left",peerId=>{
        document.getElementById(peerId)?.remove()
        // alert(`${getUser(peerId)?.username} was left the room`)
        pushNoti(`${getUser(peerId)?.username} was left the room`)
    })
    socket.on('screenChenged',peerId=>{
        alert(`${peerId} change screen`);
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
    peer.on('call',(call)=>{
        call.answer(window.localStream)
        call.on('stream',stream=>{
            addStream(getUser(window.friendId)?.username,window.friendId,stream)
        })
    })
    
    function getUser(peerId){
        return store().rooms?.members?.find(member=>member.peerId===peerId)
    }


    onMounted(()=>{
        if(document.body.offsetWidth>600){
            openStream(true)
        }
        else {
            phoneCamera(true)
        }
    })

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
    
    async function phoneCamera(firstime){
        closeCamera()
        console.log('phone camera started');
        let type = ''
        if(reerCamera.value) type = "environment"
        else type = "user"
        const media = navigator.mediaDevices.getUserMedia
        try{
            await media({
                audio:true,
                video:{
                    facingMode:type,
                    width:{min:200,max:400},
                    height:{min:200,max:500}
                }
            })
            .then(stream=>{
                window.localStream = stream
                const video = document.getElementById("localStream")
                video.srcObject = stream;
                video.addEventListener('loadedmetadata',()=>{
                    video.play();
                })
                reerCamera.value = !reerCamera.value
                if(firstime) return
                socket.emit('changeScreen',{room:store().rooms.room,peerId:store().peerId})
            })
        }catch(e){
            console.log(e);
        }
    }

    async function openStream(firstime){
        console.log('pc camera started');
        const media = navigator.mediaDevices
        if(shareScreen.value){
            try{
                await media.getDisplayMedia({
                    audio:true,
                    video:true
                })
                .then(remoteStreem=>{
                    closeCamera()
                    window.localStream = remoteStreem
                    const video = document.getElementById("localStream")
                    video.srcObject = remoteStreem;
                    video.addEventListener('loadedmetadata',()=>{
                        video.play();
                    })
                    shareScreen.value = !shareScreen.value
                    if(firstime) return
                    socket.emit('changeScreen',{room:store().rooms.room,peerId:store().peerId})
                })
            } catch(e){
                console.log(e);
            }
        }
        else{
            try{
                await media.getUserMedia({
                    audio:true,video:true
                })
                .then(remoteStreem=>{
                    closeCamera()
                    window.localStream = remoteStreem
                    const video = document.getElementById("localStream")
                    video.srcObject = remoteStreem;
                    video.addEventListener('loadedmetadata',()=>{
                        video.play();
                    })
                    shareScreen.value = !shareScreen.value
                    if(firstime) return
                    socket.emit('changeScreen',{room:store().rooms.room,peerId:store().peerId})
                })
            }catch(e){
                console.log(e);
            }
        }
    }

    function closeCamera(){
        const stream = document.getElementById("localStream").srcObject;
        try{
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(function (track) {
                    track.stop();
                });
                stream.srcObject = null
            }
        }catch(err){
            console.log(err);
        }
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
    function show(){
        alert("sorry, it's in comming!")
    }
    function leave(){
        window.location.href = "https://call-video.onrender.com";
    }
</script>
<template>
    <div class="py-[30px] lg:px-[100px] md:px-[50px] h-full overflow-y-auto bg-white">
        <div class=" z-10 flex items-center justify-end w-full py-3 px-[20px]">
          <ul class="flex md:gap-5 gap-2">
            <li @click="show()" class="cursor-pointer font-lora font-semibold hover:text-green-600 border-2 border-transparent hover:border-b-green-600 transition-all duration-100 md:text-base text-gray-600 text-sm">Developer</li>
            <li @click="show()" class="cursor-pointer font-lora font-semibold hover:text-green-600 border-2 border-transparent hover:border-b-green-600 transition-all duration-100 md:text-base text-gray-600 text-sm">DarkMode</li>
          </ul>
        </div>
        <div id="call-container" class="flex flex-wrap mt-10">
            <div class="videoCover z-0">
                <video id="localStream"  src="" muted></video>
                <span class="absolute text-xl left-0 right-0 mx-auto w-fit font-lora text-cyan-500">You</span>
                <span @click="phoneCamera(false)" class="absolute left-0 right-0 mx-auto w-fit bottom-5 cursor-pointer p-4 md:hidden block">
                    <font-awesome-icon :icon="['fas', 'camera-rotate']" size="xl" class="text-gray-400"/>
                </span>
                <span @click="openStream(false)" class="absolute left-0 right-0 mx-auto w-fit bottom-5 cursor-pointer p-4 md:block hidden">
                    <font-awesome-icon :icon="['fas', 'desktop']" size="xl" class="text-gray-400" v-if="shareScreen"/>
                    <font-awesome-icon :icon="['fas', 'camera']" size="xl" class="text-gray-400" v-else/>
                </span>
            </div>
        </div>
        <button @click="leave()"  class="py-2 absolute left-0 right-0 mx-auto bottom-10 w-[120px] border rounded hover:bg-red-600 hover:text-gray-50 transition-all duration-200 border-red-600">Leave</button>
    </div>
</template>



<style>
    .videoCover{
        position: relative;
        border-radius: 5px;
        padding: 10px;
        width: 400px;
    }  
    .videoCover video{
        border-radius: 5px;
    }  
    @media screen and (max-width:600px){
        .videoCover{
            width: 98%;
            margin: auto;
        }
    }
    .username{
        position: absolute;
        color: red;
        font-size: 20px;
        font-family: Lora;
        left: 0;
        right: 0;
        margin: auto;
    }
</style>