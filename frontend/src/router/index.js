import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Login from '../views/Auth/Login.vue'
import Register from '../views/Auth/Register.vue'
import GameOver from '../components/GameOver.vue'

const routes = [
  {
    path: '/', 
    name: 'Welcome', 
    component: Welcome
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
<<<<<<< HEAD
  },
  {
    path: '/gameover',
    name: 'GameOver',
    component: GameOver,
=======
>>>>>>> a559643d2600fd1ebb596f0be77d38ccc683acbf
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
