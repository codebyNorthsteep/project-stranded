import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Login from '../views/Auth/Login.vue'
import Register from '../views/Auth/Register.vue'

const routes = [
  {
    path: '/', 
    name: 'Welcome', 
    component: Welcome
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Auth/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Auth/Register.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
