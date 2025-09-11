<template>
  <div class="dashboard-container d-flex flex-column min-vh-100">
    <div class="container mt-5 flex-grow-1 d-flex flex-column">
      <!-- Header i kontrole -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 v-if="auth.user">
          Dobrodošao, {{ auth.user.email.split('@')[0] }}
        </h1>
        <h1 v-else>Loading...</h1>

        <!-- Button group 1 -->
        <div class="button-group">
          <button @click="showForm = !showForm" class="btn btn-success">
            {{ showForm ? "Zatvori formu" : "Dodaj Note" }}
          </button>

          <!-- Sort dropdown -->
          <div class="dropdown position-relative">
            <button class="btn btn-secondary" @click="dropdownOpen = !dropdownOpen">
              Sortiraj
            </button>
            <ul class="dropdown-menu" :class="{ show: dropdownOpen }">
              <li><a class="dropdown-item" href="#" @click.prevent="sortNotes('date')">Datum</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="sortNotes('name')">Ime</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="sortNotes('color')">Boja</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="sortNotes('tag')">Tag</a></li>
            </ul>
          </div>

          <button @click="router.push('/korisnik')" class="btn btn-info">Profil korisnika</button>
          <button @click="handleLogout" class="btn btn-danger">Logout</button>
        </div>
      </div>

      <!-- Forma za dodavanje / uređivanje note -->
      <div v-if="showForm" class="card p-3 mb-4">
        <h4>Nova Note</h4>
        <input v-model="form.name" placeholder="Ime note" class="form-control mb-2"/>
        <textarea v-model="form.description" placeholder="Opis" class="form-control mb-2"></textarea>

        <!-- Boja -->
        <label>Boja:</label>
        <select v-model="form.color" class="form-select mb-2">
          <option value="lightblue">Plava</option>
          <option value="lightgreen">Zelena</option>
          <option value="lightyellow">Žuta</option>
          <option value="lightpink">Roza</option>
        </select>

        <!-- Tag -->
        <label>Tag:</label>
        <div class="d-flex mb-2 align-items-center">
          <select v-model="form.tag" class="form-select me-2">
            <option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</option>
          </select>
          <button type="button" @click="showTagForm = !showTagForm" class="btn btn-sm btn-secondary">Novi Tag</button>
        </div>

        <!-- Novi tag input -->
        <div v-if="showTagForm" class="mb-2 d-flex">
          <input v-model="newTag" placeholder="Unesi novi tag" class="form-control me-2"/>
          <button type="button" @click="addTag" class="btn btn-primary">Dodaj Tag</button>
        </div>

        <button type="button" @click="saveNote" class="btn btn-primary">
          {{ editingNote ? "Spremi Note" : "Dodaj Note" }}
        </button>
      </div>

      <!-- Grid note-ova -->
      <div class="row flex-grow-1">
        <div class="col-md-4 mb-3" v-for="note in notesStore.notes" :key="note.id">
          <div class="card h-100 p-3" :style="{ backgroundColor: note.color }">
            <h5>{{ note.name }}</h5>
            <p>{{ note.description }}</p>
            <small class="text-muted">Tag: {{ note.tag || "Nema" }}</small><br/>
            <small class="text-muted">Dodano: {{ note.date }}</small>

            <!-- Button group 2 -->
            <div class="note-buttons">
              <button @click="editNote(note)" class="btn btn-sm btn-warning">Uredi</button>
              <button @click="deleteNote(note.id)" class="btn btn-sm btn-danger">Obriši</button>
            </div>
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

// Reactive state
const showForm = ref(false)
const editingNote = ref(null)
const form = ref({ name: "", description: "", color: "lightblue", tag: "" })
const dropdownOpen = ref(false)

// Tags
const tags = ref(["Privatno", "Posao", "Škola"])
const showTagForm = ref(false)
const newTag = ref("")

// Fetch notes
onMounted(() => { if(auth.user) notesStore.fetchNotes() })
watch(() => auth.user, (newUser) => { if(newUser) notesStore.fetchNotes() })

// Logout
function handleLogout() { 
  auth.logout() 
  router.push("/") 
}

// Novi tag
function addTag() {
  const trimmed = newTag.value.trim()
  if(trimmed && !tags.value.includes(trimmed)) {
    tags.value.push(trimmed)
    form.value.tag = trimmed
  }
  newTag.value = ""
  showTagForm.value = false
}

// Save note
async function saveNote() {
  if (!form.value.name || !form.value.description) {
    alert("Molimo popunite oba polja!")
    return
  }

  if (editingNote.value) {
    const note = { ...form.value, id: editingNote.value.id, date: editingNote.value.date }
    await notesStore.updateNote(note)
  } else {
    await notesStore.addNote({ ...form.value, date: new Date().toLocaleString() })
  }

  cancelForm()
}

// Edit note
function editNote(note) {
  editingNote.value = note
  form.value = { name: note.name, description: note.description, color: note.color, tag: note.tag || "" }
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
  form.value = { name: "", description: "", color: "lightblue", tag: "" }
  showForm.value = false
  showTagForm.value = false
  newTag.value = ""
}

// Sortiranje note-a
function sortNotes(criteria) {
  switch(criteria) {
    case 'date':
      notesStore.notes.sort((a, b) => new Date(a.date) - new Date(b.date))
      break
    case 'name':
      notesStore.notes.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'color':
      notesStore.notes.sort((a, b) => a.color.localeCompare(b.color))
      break
    case 'tag':
      notesStore.notes.sort((a, b) => (a.tag || "").localeCompare(b.tag || ""))
      break
  }
  dropdownOpen.value = false
}
</script>

<style scoped>

.card { min-height: 180px; }

.button-group {
  display: flex;
  gap: 10px;
  align-items: center;
}
.note-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container.flex-grow-1 {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.row.flex-grow-1 {
  flex-grow: 0;
}

.footer {
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: lightblue;
  color: black;
}
</style>