import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
import Camera from '../views/Camera.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index
    },
    {
      path: '/camera',
      name: 'camera',
      component: Camera
    }
  ]
})

export default router
