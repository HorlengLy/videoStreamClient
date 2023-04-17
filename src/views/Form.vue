<script>
  import { ref } from 'vue';
  import { store } from '../Store';
  import { generatorRoom,copyText } from '../data';
    export default{
        data:()=>{
          const username = ref('')
          const code = ref('')
          const room = ref(generatorRoom())
          const isJoinRoom = ref(false)
          return {code,room,username,isJoinRoom,copyText,store}
        },
        props:['joinRoom'],

    } 
</script>
<template>
  <div class="flex items-center w-full justify-center">
    <button
      @click="() => isJoinRoom = false"
      :class="[{ 'text-gray-100 bg-sky-500': !isJoinRoom }]"
      class="font-lora transition-all duration-200 py-2 rounded-l-md w-[120px] border"
    >
      Create Room
    </button>
    <button
      @click="() => isJoinRoom = true"
      :class="[{ 'text-gray-100 bg-sky-500': isJoinRoom }]"
      class="font-lora transition-all duration-200 py-2 rounded-r-md w-[120px] border"
    >
      Join Room
    </button>
  </div>
  <div class="mt-10" v-if="isJoinRoom">
    <div class="relative mx-auto">
      <input
        id="username"
        v-model="username"
        type="text"
        @keyup.enter="joinRoom(username, code)"
        class="border bg-inherit py-2 px-5 rounded-md outline-none w-full"
      />
      <label for="username" class="text-sm">Username</label>
    </div>
    <div class="relative mx-auto mt-6">
      <input
        id="code"
        v-model="code"
        type="text"
        @keyup.enter="joinRoom(username, code,true)"
        class="border bg-inherit py-2 px-5 rounded-md outline-none w-full"
      />
      <label for="code" class="text-sm">Room</label>
    </div>
    <div class="flex justify-end">
      <button
        v-if="store().loading"
        disabled
        class="py-2 w-[100px] rounded-md cursor-wait shadow shadow-gray-400 hover:shadow-sky-500 mt-5 hover:text-gray-200 text-sm transition-all duration-200"
      >
        Loading...
      </button>
      <button
        v-else
        @click="joinRoom(username, code,true)"
        class="py-2 w-[100px] rounded-md shadow shadow-gray-400 hover:shadow-sky-500 mt-5 hover:bg-sky-400 hover:text-gray-200 text-sm transition-all duration-200"
      >
        join room
      </button>
    </div>
  </div>
  <div class="mt-10" v-else>
    <div class="relative mx-auto">
      <input
        id="username"
        v-model="username"
        type="text"
        @keyup.enter="joinRoom(username, room,false)"
        class="border bg-inherit py-2 px-5 rounded-md outline-none w-full"
      />
      <label for="username" class="text-sm">Username</label>
    </div>
    <div class="relative mx-auto mt-6">
      <input
        id="room"
        v-model="room"
        disabled
        type="text"
        class="border bg-inherit py-2 px-5 rounded-md outline-none w-full"
      />
      <label for="room" class="text-sm">Room</label>
      <span
        id="btnCopy"
        @click="copyText()"
        class="bg-gray-700 absolute text-gray-200 py-[2px] px-1 cursor-pointer right-1 top-[5px] text-xs rounded-md"
      >
        copy
      </span>
    </div>
    <div class="flex justify-end">
      <button
        v-if="!store().loading"
        @click="joinRoom(username, room,false)"
        class="py-2 w-[100px] rounded-md shadow shadow-gray-400 hover:shadow-sky-500 mt-5 hover:bg-sky-400 hover:text-gray-200 text-sm transition-all duration-200"
      >
        make room
      </button>
      <button
        v-else
        disabled
        class="py-2 w-[100px] rounded-md shadow shadow-gray-400 cursor-wait hover:shadow-sky-500 mt-5  hover:text-gray-200 text-sm transition-all duration-200"
      >
        Loading...
      </button>
    </div>
  </div>
</template>


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
</style>