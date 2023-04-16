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
        // console.log({ownStream:window.localStream});
        call.on("stream",friendStream=>{
            addStream(username,peerId,friendStream)
        })
        alert(`${username} join room`)
    })
    socket.on("user-left",peerId=>{
        document.getElementById(peerId)?.remove()
        alert(`${getUser(peerId)?.username} was left the room`)
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
            // console.log({friendStream:stream});
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

    async function phoneCamera(firstime){
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
                if(window.localStream) closeCamera()
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
                    if(window.localStream) closeCamera()
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
                    audio:false,video:true
                })
                .then(remoteStreem=>{
                    if(window.localStream) closeCamera()
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
</script>
<template>
    <div class="py-[50px] h-full overflow-y-auto">
        <div id="call-container" class="p-10 flex flex-wrap">
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
        left: 30%;
    }
</style>