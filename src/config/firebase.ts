
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase - você precisará substituir pelos seus dados
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
