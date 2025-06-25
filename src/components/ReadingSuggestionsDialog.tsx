
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Sparkles, Plus, Loader2 } from 'lucide-react';
import { Book, useBooks } from '../hooks/useBooks';
import { useGemini, BookSuggestion } from '../hooks/useGemini';

interface ReadingSuggestionsDialogProps {
  completedBook: Book;
}

export default function ReadingSuggestionsDialog({ completedBook }: ReadingSuggestionsDialogProps) {
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { getReadingSuggestions } = useGemini();
  const { addBook } = useBooks();

  const loadSuggestions = async () => {
    setLoading(true);
    const result = await getReadingSuggestions(completedBook.name, completedBook.author);
    setSuggestions(result);
    setLoading(false);
  };

  const handleAddSuggestion = async (suggestion: BookSuggestion) => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await addBook({
      name: suggestion.title,
      author: suggestion.author,
      totalPages: 300, // Valor padrão
      startDate: today,
      targetEndDate: nextMonth
    });

    setIsOpen(false);
  };

  const handleOpenDialog = () => {
    setIsOpen(true);
    if (suggestions.length === 0) {
      loadSuggestions();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={handleOpenDialog}
          className="w-full mt-4"
          variant="outline"
        >
          <Sparkles className="mr-2" size={16} />
          Sugestões de Leitura
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BookOpen className="mr-2" size={20} />
            Próximas Leituras Sugeridas
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin mr-2" size={24} />
            <span>Buscando sugestões baseadas em "{completedBook.name}"...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <Card key={index} className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {suggestion.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          por {suggestion.author}
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          💡 {suggestion.reason}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddSuggestion(suggestion)}
                        className="ml-4"
                      >
                        <Plus size={14} className="mr-1" />
                        Adicionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-500">
                  Não foi possível gerar sugestões no momento.
                </p>
                <Button 
                  onClick={loadSuggestions}
                  variant="outline"
                  className="mt-4"
                >
                  Tentar Novamente
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
