
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
