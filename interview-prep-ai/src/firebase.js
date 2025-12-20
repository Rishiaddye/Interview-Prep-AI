import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "interviewprepai-e839e.firebaseapp.com",
  projectId: "interviewprepai-e839e",
  storageBucket: "interviewprepai-e839e.firebasestorage.app",
  messagingSenderId: "549309370204",
  appId: "1:549309370204:web:9f1a46b95ab180e37f3b99",
  measurementId: "G-0XLY90E8EL",
};

const app = initializeApp(firebaseConfig);

// ✅ AUTH
export const auth = getAuth(app);

// ✅ CRITICAL FIX FOR MOBILE GOOGLE LOGIN
setPersistence(auth, browserLocalPersistence);

// ✅ GOOGLE PROVIDER
export const googleProvider = new GoogleAuthProvider();

// Force account selection every time
googleProvider.setCustomParameters({
  prompt: "select_account",
});
