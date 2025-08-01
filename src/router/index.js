import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StudentView from '@/views/StudentView.vue'
import ScoreView from '@/views/ScoreView.vue'

const routes = [
  {
    path: '/student',
    name: 'student',
    component: StudentView
  },
  {
    path: '/score',
    name: 'score',
    component: ScoreView
  },
  {
    path: '/',
    name: 'home',
    component: StudentView // Default to StudentView for home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
