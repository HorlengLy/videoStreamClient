<template>
    <div class="grid place-content-center h-full">
        <div class="text-5xl text-red-600 font-bold flex justify-center">
            404
        </div>
        <div class="text-xl">
            Sorry this page doesn't exist
        </div>
        <router-link :to="{name:'home'}" class="flex justify-center">
            <button class="py-2 w-[120px] bg-sky-600 hover:border-transparent border border-sky-600 shadow-lg shadow-sky-300 mt-5 rounded-lg transition-all duration-150 hover:bg-sky-500">Home</button>
        </router-link>
    </div>
</template>
