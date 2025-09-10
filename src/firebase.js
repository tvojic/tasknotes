// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuvHDuzf7VcsRoPT1SsXcmDv1h1WSwH4Q",
  authDomain: "tasknotes-b7aca.firebaseapp.com",
  projectId: "tasknotes-b7aca",
  storageBucket: "tasknotes-b7aca.firebasestorage.app",
  messagingSenderId: "249554270502",
  appId: "1:249554270502:web:99b27044c706e1a05a69e7",
  measurementId: "G-Z2S6NEZ8C0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);