<template>
  <div class="container mt-5">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 v-if="auth.user">
        Dobrodošao, {{ auth.user.email.split('@')[0] }}
      </h1>
      <h1 v-else>Loading...</h1>
      <div>
        <button @click="showForm = !showForm" class="btn btn-success me-2">
          {{ showForm ? "Zatvori formu" : "Dodaj Note" }}
        </button>
        <button @click="handleLogout" class="btn btn-danger">Logout</button>
      </div>
    </div>

    <!-- Forma za dodavanje nove note -->
    <div v-if="showForm" class="card p-3 mb-4">
      <h4>Nova Note</h4>
      <input v-model="form.name" placeholder="Ime note" class="form-control mb-2"/>
      <textarea v-model="form.description" placeholder="Opis" class="form-control mb-2"></textarea>
      <label>Boja:</label>
      <select v-model="form.color" class="form-select mb-2">
        <option value="lightblue">Plava</option>
        <option value="lightgreen">Zelena</option>
        <option value="lightyellow">Žuta</option>
        <option value="lightpink">Roza</option>
      </select>
      <button @click="saveNote" class="btn btn-primary">Dodaj Note</button>
    </div>

    <!-- Grid note-ova -->
    <div class="row">
      <div class="col-md-4 mb-3" v-for="note in notesStore.notes" :key="note.id">
        <div class="card h-100 p-3" :style="{ backgroundColor: note.color }">
          <h5>{{ note.name }}</h5>
          <p>{{ note.description }}</p>
          <small class="text-muted">Dodano: {{ note.date }}</small>
          <div class="mt-2">
            <button @click="editNote(note)" class="btn btn-sm btn-warning me-2">Uredi</button>
            <button @click="deleteNote(note.id)" class="btn btn-sm btn-danger">Obriši</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { useNotesStore } from "@/stores/notes"

const router = useRouter()
const auth = useAuthStore()
const notesStore = useNotesStore()

const showForm = ref(false)
const editingNote = ref(null)
const form = ref({ name: "", description: "", color: "lightblue" })

// Fetch notes kada se user inicijalizira
onMounted(() => { if(auth.user) notesStore.fetchNotes() })
watch(() => auth.user, (newUser) => { if(newUser) notesStore.fetchNotes() })

// Logout
function handleLogout() { 
  auth.logout() 
  router.push("/") 
}

// Dodavanje ili edit note
async function saveNote() {
  if (!form.value.name || !form.value.description) {
    alert("Molimo popunite oba polja!")
    return
  }

  if (editingNote.value) {
    const note = { ...form.value, id: editingNote.value.id, date: editingNote.value.date }
    await notesStore.updateNote(note)
  } else {
    await notesStore.addNote(form.value)
  }

  cancelForm()
}

// Edit note
function editNote(note) {
  editingNote.value = note
  form.value = { name: note.name, description: note.description, color: note.color }
  showForm.value = true
}

// Delete note
async function deleteNote(id) {
  if(confirm("Jeste li sigurni da želite obrisati ovu note?")) {
    await notesStore.deleteNote(id)
  }
}

// Reset forme
function cancelForm() {
  editingNote.value = null
  form.value = { name: "", description: "", color: "lightblue" }
  showForm.value = false
}
</script>

<style scoped>
.card { min-height: 180px; }
</style>