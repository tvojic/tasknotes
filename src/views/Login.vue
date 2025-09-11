<template>
  <div class="login">
    <h1>Login Page</h1>
    <div class="container">
      <div class="row">
        <div class="col-sm"></div>
        <div class="col-sm">
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="emailInput">Email address</label>
              <input
                v-model="email"
                type="email"
                class="form-control"
                id="emailInput"
                placeholder="Enter email"
              />
              <small id="emailHelp" class="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>

            <div class="form-group">
              <label for="passwordInput">Password</label>
              <input
                v-model="password"
                type="password"
                class="form-control"
                id="passwordInput"
                placeholder="Password"
              />
            </div>

            <button type="submit" class="btn btn-primary">Login</button>
          </form>
        </div>
        <div class="col-sm"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { app } from "@/firebase"

const email = ref("")
const password = ref("")
const router = useRouter()
const authStore = useAuthStore()

async function handleLogin() {
  const auth = getAuth(app)
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    const firebaseUser = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: email.value.split("@")[0]
    }

    authStore.login(firebaseUser)

    alert("Login successful!")
    router.push("/dashboard")
  } catch (error) {
    console.error("Login error:", error.message)
    alert(error.message)
  }
}
</script>