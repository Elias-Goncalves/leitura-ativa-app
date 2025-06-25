import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, Gauge, Bookmark, Award, Plus, Edit3, Trash2 } from 'lucide-react';
import { Book, useBooks } from '../hooks/useBooks';
import { toast } from '@/hooks/use-toast';
import ReadingSuggestionsDialog from './ReadingSuggestionsDialog';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const [showDailyInput, setShowDailyInput] = useState(false);
  const [showBookmarkInput, setShowBookmarkInput] = useState(false);
  const [dailyPages, setDailyPages] = useState('');
  const [currentPage, setCurrentPage] = useState(book.currentPage?.toString() || '');
  
  const { updateBook, deleteBook } = useBooks();

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const todayString = getTodayString();
  const pagesReadToday = book.dailyProgress?.[todayString] || 0;
  const isCompleted = book.pagesRead >= book.totalPages;
  const progress = Math.min(100, (book.pagesRead / book.totalPages) * 100);

  const calculateDailyGoal = () => {
    const today = new Date();
    const startDate = book.startDate.toDate ? book.startDate.toDate() : new Date(book.startDate);
    const targetDate = book.targetEndDate.toDate ? book.targetEndDate.toDate() : new Date(book.targetEndDate);
    
    const totalDays = Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const remainingPages = book.totalPages - book.pagesRead;
    
    return Math.ceil(remainingPages / Math.max(1, totalDays));
  };

  const dailyGoal = calculateDailyGoal();

  const handleAddDailyPages = async () => {
    const pages = parseInt(dailyPages);
    if (isNaN(pages) || pages <= 0) {
      toast({
        title: "Erro",
        description: "Digite um número válido de páginas.",
        variant: "destructive"
      });
      return;
    }

    const remainingPages = book.totalPages - book.pagesRead;
    if (pages > remainingPages) {
      toast({
        title: "Erro",
        description: `Só faltam ${remainingPages} páginas para terminar o livro.`,
        variant: "destructive"
      });
      return;
    }

    const newPagesRead = Math.min(book.pagesRead + pages, book.totalPages);
    const updatedDailyProgress = {
      ...book.dailyProgress,
      [todayString]: (book.dailyProgress?.[todayString] || 0) + pages
    };

    await updateBook(book.id, {
      pagesRead: newPagesRead,
      dailyProgress: updatedDailyProgress,
      lastReadDate: new Date()
    });

    setDailyPages('');
    setShowDailyInput(false);
    
    toast({
      title: "Progresso atualizado!",
      description: `Você leu ${pages} páginas hoje.`
    });
  };

  const handleUpdateBookmark = async () => {
    const page = parseInt(currentPage);
    if (isNaN(page) || page < 0 || page > book.totalPages) {
      toast({
        title: "Erro",
        description: "Digite um número de página válido.",
        variant: "destructive"
      });
      return;
    }

    await updateBook(book.id, { currentPage: page });
    setShowBookmarkInput(false);
    
    toast({
      title: "Marcador atualizado!",
      description: `Página ${page} marcada como atual.`
    });
  };

  const handleDeleteBook = async () => {
    if (window.confirm("Tem certeza que deseja remover este livro?")) {
      await deleteBook(book.id);
    }
  };

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {book.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
              Autor: {book.author}
            </p>
            {book.year && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                Ano: {book.year}
              </p>
            )}
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {book.totalPages} páginas
            </p>
          </div>
          
          <div className="flex space-x-2">
            {isCompleted && <Award className="text-yellow-500" size={24} />}
            <Button variant="ghost" size="sm" onClick={handleDeleteBook}>
              <Trash2 className="text-red-500" size={16} />
            </Button>
          </div>
        </div>

        {book.coverImageUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={book.coverImageUrl}
              alt={`Capa de ${book.name}`}
              className="w-24 h-36 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Gauge className="mr-2 text-blue-500" size={20} />
            <span className="text-sm font-medium">
              {Math.round(progress)}% concluído
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <div className="mb-4">
          <p className="text-gray-800 dark:text-gray-100 text-lg font-semibold">
            {book.pagesRead} / {book.totalPages} páginas lidas
          </p>
          
          {book.currentPage !== undefined && (
            <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center mt-1">
              <Bookmark className="mr-1" size={16} />
              Marcador: página {book.currentPage}
            </p>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-1">
            <Calendar className="mr-2" size={16} />
            Início: {book.startDate.toDate ? book.startDate.toDate().toLocaleDateString('pt-BR') : new Date(book.startDate).toLocaleDateString('pt-BR')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <Calendar className="mr-2" size={16} />
            Meta: {book.targetEndDate.toDate ? book.targetEndDate.toDate().toLocaleDateString('pt-BR') : new Date(book.targetEndDate).toLocaleDateString('pt-BR')}
          </p>
        </div>

        {!isCompleted && (
          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                Meta diária: {dailyGoal} páginas
              </p>
              <p className="text-blue-600 dark:text-blue-300 text-sm">
                Hoje você leu: {pagesReadToday} páginas
              </p>
              {pagesReadToday >= dailyGoal && (
                <p className="text-green-600 dark:text-green-400 text-sm font-semibold">
                  🎉 Meta diária concluída!
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => setShowDailyInput(!showDailyInput)}
                className="w-full"
                variant="default"
              >
                <BookOpen className="mr-2" size={16} />
                Adicionar Leitura
              </Button>

              {showDailyInput && (
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Páginas lidas"
                    value={dailyPages}
                    onChange={(e) => setDailyPages(e.target.value)}
                    min="1"
                    max={book.totalPages - book.pagesRead}
                  />
                  <Button onClick={handleAddDailyPages} size="sm">
                    <Plus size={16} />
                  </Button>
                </div>
              )}

              <Button
                onClick={() => setShowBookmarkInput(!showBookmarkInput)}
                className="w-full"
                variant="outline"
              >
                <Bookmark className="mr-2" size={16} />
                Marcar Página
              </Button>

              {showBookmarkInput && (
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Página atual"
                    value={currentPage}
                    onChange={(e) => setCurrentPage(e.target.value)}
                    min="0"
                    max={book.totalPages}
                  />
                  <Button onClick={handleUpdateBookmark} size="sm">
                    <Bookmark size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="space-y-3">
            <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 p-4 rounded-lg text-center">
              <BookOpen className="mx-auto mb-2" size={30} />
              <p className="font-semibold">Parabéns! Livro concluído! 🎉</p>
            </div>
            
            <ReadingSuggestionsDialog completedBook={book} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
