import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Login from '../views/Auth/Login.vue'
import Register from '../views/Auth/Register.vue'
import MyDashboard from '../views/MyDashboard.vue'
import Quiz from '../views/QuizView.vue'
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
  },
  {
    path: '/dashboard',
    name: 'MyDashboard',
    component: MyDashboard,
  },
  {
    path: '/quiz/:levelName',
    name: 'Quiz',
    component: Quiz,
  },
  {
    path: '/gameover',
    name: 'GameOver',
    component: GameOver,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
