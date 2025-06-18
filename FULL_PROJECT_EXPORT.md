
# Leitura Ativa - Exportação Completa do Projeto

Este arquivo contém todos os códigos-fonte do aplicativo Leitura Ativa para facilitar a exportação e recriação do projeto.

## Estrutura do Projeto

```
src/
├── components/
│   ├── ui/
│   ├── AddBookForm.tsx
│   ├── AuthScreen.tsx
│   ├── BookCard.tsx
│   └── Dashboard.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/
│   ├── useBooks.tsx
│   ├── useFirebase.tsx
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts
├── pages/
│   └── NotFound.tsx
├── config/
│   └── firebase.ts
├── App.tsx
├── main.tsx
├── index.css
└── vite-env.d.ts
```

---

## Arquivo: package.json

```json
{
  "name": "leitura-ativa",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@tanstack/react-query": "^4.36.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "embla-carousel-react": "^8.0.0-rc22",
    "firebase": "^10.7.1",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.263.1",
    "react": "^18.2.0",
    "react-day-picker": "^8.10.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.43.9",
    "react-resizable-panels": "^0.0.55",
    "react-router-dom": "^6.20.1",
    "recharts": "^2.8.0",
    "sonner": "^1.3.1",
    "tailwind-merge": "^1.14.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.0"
  }
}
```

---

## Arquivo: src/config/firebase.ts

```typescript
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
```

---

## Arquivo: src/App.tsx

```typescript
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FirebaseProvider } from "./hooks/useFirebase";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={currentUser ? <Dashboard /> : <AuthScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <FirebaseProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </AuthProvider>
        </FirebaseProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

---

## Arquivo: src/main.tsx

```typescript
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
```

---

## Arquivo: src/contexts/AuthContext.tsx

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
```

---

## Arquivo: src/contexts/ThemeContext.tsx

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

---

## Arquivo: src/hooks/useFirebase.tsx

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';

interface FirebaseContextType {
  auth: typeof auth;
  db: typeof db;
  userId: string | null;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUserId(user?.uid || null);
    });
    return unsubscribe;
  }, []);

  return (
    <FirebaseContext.Provider value={{ auth, db, userId }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
```

---

## Arquivo: src/hooks/useBooks.tsx

```typescript
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from './useFirebase';
import { toast } from '@/hooks/use-toast';

export interface Book {
  id: string;
  name: string;
  author: string;
  year?: number;
  totalPages: number;
  pagesRead: number;
  currentPage?: number;
  startDate: any;
  targetEndDate: any;
  coverImageUrl?: string;
  dailyProgress?: { [date: string]: number };
  lastReadDate?: any;
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { db, userId } = useFirebase();

  useEffect(() => {
    if (!userId) {
      setBooks([]);
      setLoading(false);
      return;
    }

    const booksCollection = collection(db, 'users', userId, 'books');
    const q = query(booksCollection);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];
      setBooks(booksData);
      setLoading(false);
    });

    return unsubscribe;
  }, [db, userId]);

  const addBook = async (bookData: Omit<Book, 'id' | 'pagesRead' | 'dailyProgress'>) => {
    if (!userId) return;
    
    try {
      await addDoc(collection(db, 'users', userId, 'books'), {
        ...bookData,
        pagesRead: 0,
        dailyProgress: {},
        createdAt: serverTimestamp()
      });
      toast({
        title: "Livro adicionado!",
        description: "O livro foi adicionado à sua biblioteca."
      });
    } catch (error) {
      console.error("Erro ao adicionar livro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o livro.",
        variant: "destructive"
      });
    }
  };

  const updateBook = async (bookId: string, updates: Partial<Book>) => {
    if (!userId) return;
    
    try {
      const bookRef = doc(db, 'users', userId, 'books', bookId);
      await updateDoc(bookRef, updates);
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o livro.",
        variant: "destructive"
      });
    }
  };

  const deleteBook = async (bookId: string) => {
    if (!userId) return;
    
    try {
      const bookRef = doc(db, 'users', userId, 'books', bookId);
      await deleteDoc(bookRef);
      toast({
        title: "Livro removido",
        description: "O livro foi removido da sua biblioteca."
      });
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o livro.",
        variant: "destructive"
      });
    }
  };

  return {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook
  };
}
```

---

## Arquivo: src/components/AuthScreen.tsx

```typescript
import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AuthScreen() {
  const { login, signup } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor, preencha o e-mail e a senha.');
      setLoading(false);
      return;
    }

    if (!isLoginMode && password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (error: any) {
      let errorMessage = 'Erro na autenticação. Tente novamente.';
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Endereço de e-mail inválido.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Sua conta foi desativada.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'E-mail ou senha incorretos.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {isLoginMode ? 'Bem-vindo de Volta!' : 'Crie sua Conta'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {isLoginMode ? 'Acesse sua conta para continuar.' : 'Junte-se ao Leitura Ativa!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="pl-10"
                required
              />
            </div>
          </div>

          {!isLoginMode && (
            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin mr-2" size={20} />
            ) : isLoginMode ? (
              <LogIn className="mr-2" size={20} />
            ) : (
              <UserPlus className="mr-2" size={20} />
            )}
            {isLoginMode ? 'Entrar' : 'Criar Conta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-300 text-sm">
          {isLoginMode ? (
            <>
              Não tem uma conta?{' '}
              <button
                onClick={() => {
                  setIsLoginMode(false);
                  setError('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-blue-600 hover:underline focus:outline-none"
              >
                Crie uma aqui!
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{' '}
              <button
                onClick={() => {
                  setIsLoginMode(true);
                  setError('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-blue-600 hover:underline focus:outline-none"
              >
                Faça Login!
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
```

---

## Arquivo: src/components/Dashboard.tsx

```typescript
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { LogOut, BookOpen, Plus, Sun, Moon, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BookCard from './BookCard';
import AddBookForm from './AddBookForm';
import { useBooks } from '../hooks/useBooks';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { books, loading } = useBooks();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedBooks = books.filter(book => book.pagesRead >= book.totalPages);
  const activeBooks = books.filter(book => book.pagesRead < book.totalPages);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 animate-pulse" size={48} />
          <p className="text-gray-600 dark:text-gray-300">Carregando sua biblioteca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <BookOpen className="mr-3" size={32} />
              Leitura Ativa
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Bem-vindo, {currentUser?.email}!
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {activeBooks.length} livro(s) em progresso • {completedBooks.length} concluído(s)
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={toggleTheme} variant="outline" size="sm">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center">
              <Plus className="mr-2" size={16} />
              Novo Livro
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2" size={16} />
              Sair
            </Button>
          </div>
        </div>

        {/* Search */}
        {books.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Buscar livros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Add Book Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md">
              <AddBookForm onClose={() => setShowAddForm(false)} />
            </div>
          </div>
        )}

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="text-center py-12">
            <Search className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 dark:text-gray-300">
              Nenhum livro encontrado para "{searchTerm}"
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Sua biblioteca está vazia
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Adicione seu primeiro livro para começar a acompanhar sua leitura!
            </p>
            <Button onClick={() => setShowAddForm(true)} className="flex items-center mx-auto">
              <Plus className="mr-2" size={16} />
              Adicionar Primeiro Livro
            </Button>
          </div>
        )}

        {/* Statistics */}
        {books.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Total de Livros
              </h4>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {books.length}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Páginas Lidas
              </h4>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {books.reduce((sum, book) => sum + book.pagesRead, 0)}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Livros Concluídos
              </h4>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {completedBooks.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Arquivo: src/components/AddBookForm.tsx

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';

interface AddBookFormProps {
  onClose: () => void;
}

export default function AddBookForm({ onClose }: AddBookFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    year: '',
    totalPages: '',
    startDate: new Date().toISOString().split('T')[0],
    targetEndDate: '',
    coverImageUrl: ''
  });

  const { addBook } = useBooks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.author || !formData.totalPages || !formData.targetEndDate) {
      return;
    }

    await addBook({
      name: formData.name,
      author: formData.author,
      year: formData.year ? parseInt(formData.year) : undefined,
      totalPages: parseInt(formData.totalPages),
      startDate: new Date(formData.startDate),
      targetEndDate: new Date(formData.targetEndDate),
      coverImageUrl: formData.coverImageUrl || undefined
    });

    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Plus className="mr-2" size={20} />
          Adicionar Novo Livro
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={20} />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Livro *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="author">Autor *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="year">Ano de Publicação</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => handleChange('year', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="totalPages">Total de Páginas *</Label>
            <Input
              id="totalPages"
              type="number"
              value={formData.totalPages}
              onChange={(e) => handleChange('totalPages', e.target.value)}
              required
              min="1"
            />
          </div>
          
          <div>
            <Label htmlFor="startDate">Data de Início</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="targetEndDate">Data Meta para Conclusão *</Label>
            <Input
              id="targetEndDate"
              type="date"
              value={formData.targetEndDate}
              onChange={(e) => handleChange('targetEndDate', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="coverImageUrl">URL da Capa</Label>
            <Input
              id="coverImageUrl"
              type="url"
              value={formData.coverImageUrl}
              onChange={(e) => handleChange('coverImageUrl', e.target.value)}
              placeholder="https://exemplo.com/capa.jpg"
            />
          </div>
          
          <Button type="submit" className="w-full">
            Adicionar Livro
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

---

## Arquivo: src/components/BookCard.tsx

```typescript
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Edit, Trash2, Plus, Check, X } from 'lucide-react';
import { useBooks, Book } from '../hooks/useBooks';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { updateBook, deleteBook } = useBooks();
  const [isEditing, setIsEditing] = useState(false);
  const [newPages, setNewPages] = useState(book.pagesRead.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  const progress = (book.pagesRead / book.totalPages) * 100;
  const isCompleted = book.pagesRead >= book.totalPages;

  const handleUpdateProgress = async () => {
    const pages = parseInt(newPages);
    if (isNaN(pages) || pages < 0 || pages > book.totalPages) return;

    setIsUpdating(true);
    await updateBook(book.id, { 
      pagesRead: pages,
      lastReadDate: new Date()
    });
    setIsEditing(false);
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    await deleteBook(book.id);
  };

  const formatDate = (date: any) => {
    if (!date) return '';
    try {
      return new Date(date.seconds ? date.seconds * 1000 : date).toLocaleDateString('pt-BR');
    } catch {
      return '';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold line-clamp-2">
              {book.name}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              por {book.author}
            </p>
            {book.year && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {book.year}
              </p>
            )}
          </div>
          {book.coverImageUrl && (
            <img 
              src={book.coverImageUrl} 
              alt={`Capa de ${book.name}`}
              className="w-16 h-20 object-cover rounded ml-3"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso</span>
            {isCompleted && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Check className="w-3 h-3 mr-1" />
                Concluído
              </Badge>
            )}
          </div>
          
          <Progress value={progress} className="mb-2" />
          
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
            <span>{book.pagesRead} de {book.totalPages} páginas</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Início:</span>
              <span>{formatDate(book.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span>Meta:</span>
              <span>{formatDate(book.targetEndDate)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={newPages}
                onChange={(e) => setNewPages(e.target.value)}
                min="0"
                max={book.totalPages}
                className="flex-1"
                placeholder="Páginas lidas"
              />
              <Button 
                size="sm" 
                onClick={handleUpdateProgress}
                disabled={isUpdating}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setNewPages(book.pagesRead.toString());
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-between">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="flex-1 mr-2"
              >
                <Edit className="w-4 h-4 mr-1" />
                Atualizar
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover livro</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja remover "{book.name}" da sua biblioteca? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Arquivo: src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Definition of the design system. All colors, gradients, fonts, etc should be defined here. */

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;

    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}
```

---

## Arquivo: vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

---

## Arquivo: tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

## Instruções para Instalação

1. **Clone ou baixe os arquivos**
2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o Firebase:**
   - Substitua as configurações em `src/config/firebase.ts`
   - Siga as instruções em `FIREBASE_SETUP.md`

4. **Execute o projeto:**
   ```bash
   npm run dev
   ```

5. **Para build de produção:**
   ```bash
   npm run build
   ```

---

## Recursos do Aplicativo

- ✅ Autenticação com Firebase (Login/Cadastro)
- ✅ Tema claro/escuro
- ✅ Adicionar livros à biblioteca
- ✅ Acompanhar progresso de leitura
- ✅ Buscar livros
- ✅ Estatísticas de leitura
- ✅ Interface responsiva
- ✅ Dados salvos no Firestore

## Tecnologias Utilizadas

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Firebase (Auth + Firestore)
- React Query
- React Router DOM
- Lucide React (ícones)

---

*Criado com ❤️ usando Lovable*
