import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './pages/Home.vue'
import Game from './pages/Game.vue'
import OrderTracking from './pages/OrderTracking.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/game', component: Game },
  { path: '/track', component: OrderTracking }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
