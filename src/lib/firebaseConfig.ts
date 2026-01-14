import { initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2VdEiMHiQ9eq7JXdANGFfTyML-_6CgK4",
  authDomain: "jornal-bbb28.firebaseapp.com",
  projectId: "jornal-bbb28",
  storageBucket: "jornal-bbb28.firebasestorage.app",
  messagingSenderId: "124866415264",
  appId: "1:124866415264:web:a1c532c6b4011de80397c5",
  measurementId: "G-5HBD2D7YWF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
