
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, BookOpen } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <BookOpen className="mr-3" size={32} />
              Leitura Ativa
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Bem-vindo, {currentUser?.email}!
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2" size={20} />
            Sair
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Sua biblioteca de livros será exibida aqui em breve! 📚
          </p>
        </div>
      </div>
    </div>
  );
}
