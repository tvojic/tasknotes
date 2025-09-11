import { defineStore } from "pinia"
import { ref } from "vue"
import { db } from "@/firebase"
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { useAuthStore } from "./auth"

export const useNotesStore = defineStore("notes", () => {
  const notes = ref([])
  const auth = useAuthStore()
  const notesCollection = collection(db, "notes")

  // Dohvati note korisnika
  async function fetchNotes() {
    if (!auth.user) return
    const q = query(notesCollection, where("userId", "==", auth.user.uid))
    const snapshot = await getDocs(q)
    notes.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  // Dodaj note
  async function addNote(note) {
    if (!auth.user) return
    const today = new Date()
    const date = `${today.getDate().toString().padStart(2,'0')}.${(today.getMonth()+1).toString().padStart(2,'0')}.${today.getFullYear()}`
    const newNote = { ...note, userId: auth.user.uid, date, tag: note.tag || "" }
    const docRef = await addDoc(notesCollection, newNote)
    notes.value.push({ id: docRef.id, ...newNote })
  }

  // Uredi note
  async function updateNote(note) {
    const docRef = doc(db, "notes", note.id)
    await updateDoc(docRef, { 
      name: note.name, 
      description: note.description, 
      color: note.color,
      tag: note.tag || ""
    })
    const index = notes.value.findIndex(n => n.id === note.id)
    if (index !== -1) notes.value[index] = note
  }

  // Obriši note
  async function deleteNote(id) {
    await deleteDoc(doc(db, "notes", id))
    notes.value = notes.value.filter(n => n.id !== id)
  }

  // Sortiranje note-ova
  function sortNotes(criteria) {
    switch(criteria) {
      case 'date':
        notes.value.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case 'name':
        notes.value.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'color':
        notes.value.sort((a, b) => a.color.localeCompare(b.color))
        break
      case 'tag':
        notes.value.sort((a, b) => (a.tag || "").localeCompare(b.tag || ""))
        break
    }
  }

  return { notes, fetchNotes, addNote, updateNote, deleteNote, sortNotes }
})