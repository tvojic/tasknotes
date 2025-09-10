import { defineStore } from "pinia"
import { ref } from "vue"
import { db } from "@/firebase"
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { useAuthStore } from "./auth"

export const useNotesStore = defineStore("notes", () => {
  const notes = ref([])
  const auth = useAuthStore()
  const notesCollection = collection(db, "notes")

  async function fetchNotes() {
    if (!auth.user) return
    const q = query(notesCollection, where("userId", "==", auth.user.uid))
    const snapshot = await getDocs(q)
    notes.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  async function addNote(note) {
    if (!auth.user) return
    const today = new Date()
    const date = `${today.getDate().toString().padStart(2,'0')}.${(today.getMonth()+1).toString().padStart(2,'0')}.${today.getFullYear()}`
    const newNote = { ...note, userId: auth.user.uid, date }
    const docRef = await addDoc(notesCollection, newNote)
    notes.value.push({ id: docRef.id, ...newNote })
  }

  async function updateNote(note) {
    const docRef = doc(db, "notes", note.id)
    await updateDoc(docRef, { name: note.name, description: note.description, color: note.color })
    const index = notes.value.findIndex(n => n.id === note.id)
    if (index !== -1) notes.value[index] = note
  }

  async function deleteNote(id) {
    await deleteDoc(doc(db, "notes", id))
    notes.value = notes.value.filter(n => n.id !== id)
  }

  return { notes, fetchNotes, addNote, updateNote, deleteNote }
})
