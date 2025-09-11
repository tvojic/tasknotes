<template>
  <div class="signup">
    <h1>Sign Up</h1>
    <div class="container">
      <div class="row">
        <div class="col-sm"></div>
        <div class="col-sm">
          <form @submit.prevent="handleSignup">
            <div class="form-group">
              <label for="emailInput">Email address</label>
              <input
                v-model="email"
                type="email"
                class="form-control"
                id="emailInput"
                placeholder="Enter email"
                required
              />
              <small class="form-text text-muted">
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
                required
              />
            </div>

            <div class="form-group">
              <label for="confirmPasswordInput">Confirm Password</label>
              <input
                v-model="passwordAgain"
                type="password"
                class="form-control"
                id="confirmPasswordInput"
                placeholder="Confirm Password"
                required
              />
            </div>

            <button type="submit" class="btn btn-primary">Sign Up</button>
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { app } from "@/firebase"

const email = ref("")
const password = ref("")
const passwordAgain = ref("")

const router = useRouter()
const authStore = useAuthStore()

async function handleSignup() {
  if (password.value !== passwordAgain.value) {
    alert("Passwords do not match!")
    return
  }

  const auth = getAuth(app)
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    const firebaseUser = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: userCredential.user.displayName || email.value.split("@")[0]
    }

    authStore.login(firebaseUser)

    alert("Signup successful!")
    router.push("/dashboard")

    email.value = ""
    password.value = ""
    passwordAgain.value = ""
  } catch (error) {
    console.error("Signup error:", error.message)
    alert(error.message)
  }
}
</script>