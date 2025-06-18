// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
