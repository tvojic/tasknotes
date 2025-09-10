<template>
  <div class="dashboard text-center" style="padding: 50px;">
    <h1>Dashboard</h1>

    <div v-if="auth.user">
      <p>Dobrodošao, {{ auth.user.name }}!</p>
      <button @click="handleLogout" class="btn btn-danger">Logout</button>
    </div>

    <div v-else>
      <p>Loading user...</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const auth = useAuthStore()

function handleLogout() {
  auth.logout()
  router.push("/") // vraća na landing page
}
</script>