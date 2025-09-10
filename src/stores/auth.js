import { defineStore } from "pinia"
import { ref } from "vue"
import { auth } from "@/firebase"
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth"

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null)
  const isLoggedIn = ref(false)

  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      user.value = { uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName }
      isLoggedIn.value = true
    } else {
      user.value = null
      isLoggedIn.value = false
    }
  })

  async function login(userData) {
  user.value = userData
  isLoggedIn.value = true
}

  async function signup(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    user.value = { uid: userCredential.user.uid, email: userCredential.user.email }
    isLoggedIn.value = true
  }

  async function logout() {
    await signOut(auth)
    user.value = null
    isLoggedIn.value = false
  }

  return { user, isLoggedIn, login, signup, logout }
})