import { defineStore } from "pinia"
import { ref } from "vue"

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("user") || "null"))
  const isLoggedIn = ref(!!user.value)

  function login(userData) {
    localStorage.setItem("user", JSON.stringify(userData))
    user.value = userData
    isLoggedIn.value = true
  }

  function logout() {
    localStorage.removeItem("user")
    user.value = null
    isLoggedIn.value = false
  }

  return { user, isLoggedIn, login, logout }
})