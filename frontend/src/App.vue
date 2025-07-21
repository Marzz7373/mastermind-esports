<template>
  <router-view />
</template>

<script setup>
import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Game from './pages/Game.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/game/:slug', component: Game },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

</script>
