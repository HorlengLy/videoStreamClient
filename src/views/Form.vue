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
  <div class="flex cursor-pointer items-center w-full justify-center">
    <button
      @click="() => isJoinRoom = false"
      :class="[{ 'text-gray-100 bg-sky-500': !isJoinRoom }]"
      class="font-lora dark:text-gray-300 transition-all duration-200 py-2 rounded-l-md w-[120px] border"
    >
      Create Room
    </button>
    <button
      @click="() => isJoinRoom = true"
      :class="[{ 'text-gray-100 bg-sky-500': isJoinRoom }]"
      class="font-lora transition-all dark:text-gray-300 duration-200 py-2 rounded-r-md w-[120px] border"
    >
      Join Room
    </button>
  </div>
  <div class="mt-10" v-if="isJoinRoom">
    <div class="relative mx-auto">
      <input
        id="username"
        v-model="username"
        type="email"
        @keyup.enter="joinRoom(username, code)"
        class="peer border focus:ring-2 focus:border-transparent transition-all duration-200 ring-sky-300 text-gray-600 dark:text-gray-300 bg-transparent py-2 px-5 rounded-md outline-none w-full"
      />
      <label for="username" class="peer-focus:top-[-10px] peer-invalid:top-[-10px] absolute left-[20px] top-[10px] transition-all duration-200 ease-out text-sm bg-white dark:bg-slate-700  text-gray-600 dark:text-gray-300">Username</label>
    </div>
    <div class="relative mx-auto mt-6">
      <input
        id="code"
        v-model="code"
        type="email"
        @keyup.enter="joinRoom(username, code,true)"
        class="peer border focus:ring-2 focus:border-transparent transition-all duration-200 ring-sky-300 text-gray-600 dark:text-gray-300 bg-transparent py-2 px-5 rounded-md outline-none w-full"
      />
      <label for="code" class="peer-focus:top-[-10px] peer-invalid:top-[-10px] absolute left-[20px] top-[10px] transition-all duration-200 ease-out text-sm bg-white dark:bg-slate-700  text-gray-600 dark:text-gray-300">Room</label>
    </div>
    <div class="flex justify-end">
      <button
        v-if="store().loading"
        disabled
        class="py-2 text-gray-600 dark:text-gray-300 w-[100px] rounded-md cursor-wait shadow shadow-gray-400 hover:shadow-sky-500 mt-5 hover:text-gray-200 text-sm transition-all duration-200"
      >
        Loading...
      </button>
      <button
        v-else
        @click="joinRoom(username, code,true)"
        class="py-2 w-[100px]  text-gray-600 dark:text-gray-300 rounded-md shadow shadow-gray-400 hover:shadow-sky-500 mt-5 hover:bg-sky-400 hover:text-gray-200 text-sm transition-all duration-200"
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
        type="email"
        @keyup.enter="joinRoom(username, room,false)"
        class="peer border focus:ring-2 focus:border-transparent transition-all duration-200 ring-sky-300 text-gray-600 dark:text-gray-300 bg-transparent py-2 px-5 rounded-md outline-none w-full"
      />
      <label for="username" class="peer-focus:top-[-10px] peer-invalid:top-[-10px] absolute left-[20px] top-[10px] transition-all duration-200 ease-out text-sm bg-white dark:bg-slate-700  text-gray-600 dark:text-gray-300">Username</label>
    </div>
    <div class="relative mx-auto mt-6">
      <input
        id="room"
        v-model="room"
        type="text"
        disabled
        class="peer border bg-transparent py-2 px-5 rounded-md outline-none w-full  text-gray-600 dark:text-gray-300"
      />
      <label for="room" class="top-[-10px] absolute left-[20px]  transition-all duration-200 ease-out text-sm bg-white dark:bg-slate-700  text-gray-600 dark:text-gray-300">Room</label>
      <span
        id="btnCopy"
        @click="copyText()"
        class="bg-gray-700 dark:bg-gray-600 absolute text-gray-200 py-[2px] px-1 cursor-pointer right-1 top-[5px] text-xs rounded-md"
      >
        copy
      </span>
    </div>
    <div class="flex justify-end">
      <button
        v-if="!store().loading"
        @click="joinRoom(username, room,false)"
        class="py-2 w-[100px]  text-gray-600 dark:text-gray-300 rounded-md shadow shadow-gray-400 hover:shadow-sky-500 mt-5 hover:bg-sky-400 hover:text-gray-200 text-sm transition-all duration-200"
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
  /* label{
        position: absolute;
        transition: top .2s ease-out;
        left: 20px;
        top: 12px;
    }
    input:focus + label,input:valid + label,#room + label{
        top: -10px;
    } */
</style>