
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// SUBSTITUA ESTAS CONFIGURAÇÕES PELAS SUAS DO CONSOLE DO FIREBASE
// Vá em: Console Firebase > Configurações do Projeto > Seus aplicativos > Configuração
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Substitua pela sua API Key
  authDomain: "seu-projeto.firebaseapp.com",        // Substitua pelo seu Auth Domain
  projectId: "seu-projeto-id",                      // Substitua pelo seu Project ID
  storageBucket: "seu-projeto.appspot.com",         // Substitua pelo seu Storage Bucket
  messagingSenderId: "123456789012",                // Substitua pelo seu Messaging Sender ID
  appId: "1:123456789012:web:abcdefghijk123456"     // Substitua pelo seu App ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
