import { createRouter, createWebHistory } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import Login from "@/views/Login.vue"
import Signup from "@/views/Signup.vue"
import Dashboard from "@/views/Dashboard.vue"
import { useAuthStore } from "@/stores/auth"

const routes = [
  { path: "/", name: "Home", component: HomeView },
  { path: "/login", name: "Login", component: Login },
  { path: "/signup", name: "Signup", component: Signup },
  { path: "/dashboard", name: "Dashboard", component: Dashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Route guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const loggedIn = authStore.isLoggedIn

  if (to.path === "/dashboard" && !loggedIn) {
    next("/login") // ako nije logiran, šalji na login
  } else if ((to.path === "/login" || to.path === "/signup") && loggedIn) {
    next("/dashboard") // ako je već logiran, šalji na dashboard
  } else {
    next() // inače pusti
  }
})

export default router
