
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// IMPORTANTE: Substitua essas informações pelas do SEU projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBa3Up5rAqf92NltQSp9Q9d7X9wk4hGiCM",
  authDomain: "leitura-de-livros.firebaseapp.com",
  projectId: "leitura-de-livros",
  storageBucket: "leitura-de-livros.firebasestorage.app",
  messagingSenderId: "74013935926",
  appId: "1:74013935926:web:418f1a83fb17b49c0f8b97",
  measurementId: "G-TH3W3JMB37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);

// Log para verificar se Firebase foi inicializado corretamente
console.log("Firebase inicializado:", app.name);
console.log("Auth configurado:", auth.app.name);
console.log("Firestore configurado:", db.app.name);
