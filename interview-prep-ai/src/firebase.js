import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyC3shx_gmeJfHjs2l3MREoZCsvz5fIwOKw",
  authDomain: "interviewprepai-e839e.firebaseapp.com",
  projectId: "interviewprepai-e839e",
  storageBucket: "interviewprepai-e839e.firebasestorage.app",
  messagingSenderId: "549309370204",
  appId: "1:549309370204:web:9f1a46b95ab180e37f3b99",
  measurementId: "G-0XLY90E8EL"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

// ⭐ Force account selection popup every time
googleProvider.setCustomParameters({
  prompt: "select_account",
});
