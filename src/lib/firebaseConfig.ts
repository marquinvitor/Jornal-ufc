
import { initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdJUzRW885v8i9BVE1b6qJun4M3hdmP4k",
  authDomain: "jornal-6153f.firebaseapp.com",
  projectId: "jornal-6153f",
  storageBucket: "jornal-6153f.firebasestorage.app",
  messagingSenderId: "641673971158",
  appId: "1:641673971158:web:86a451415159433553d077",
  measurementId: "G-4KCW465EH8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);