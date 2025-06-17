
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
