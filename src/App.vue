<template>
  <div  class="h-screen bg-gray-200 overflow-hidden"> 
    <div class=" z-10 fixed bg-white flex items-center justify-between w-full py-3 px-[10%]  shadow shadow-gray-50">
      <span class="md:text-3xl text-xl font-lora font-bold text-gray-500" >Video Call</span>
      <ul class="flex md:gap-5 gap-2">
        <li class="cursor-pointer hover:border-b-2 transition-all duration-100 md:text-base text-gray-600 text-sm">Developer</li>
        <li class="cursor-pointer hover:border-b-2 transition-all duration-100 md:text-base text-gray-600 text-sm">DarkMode</li>
      </ul>
    </div>
    <router-view />
  </div>
</template>