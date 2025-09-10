<template>
  <div class="container mt-5">
    <h1>Korisnički Profil</h1>

    <div v-if="auth.user" class="card p-4 mt-3">
      <p><strong>Email:</strong> {{ auth.user.email }}</p>
      <p><strong>UID:</strong> {{ auth.user.uid }}</p>
      <p><strong>Korisničko ime:</strong> {{ auth.user.name || auth.user.email.split('@')[0] }}</p>

      <button @click="goBack" class="btn btn-secondary mt-3">Nazad na Dashboard</button>
    </div>

    <div v-else>
      <p>Učitavanje korisnika ili niste prijavljeni...</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const auth = useAuthStore()

function goBack() {
  router.push("/dashboard")
}
</script>

<style scoped>
.card {
  max-width: 500px;
  margin: 0 auto;
}
</style>
