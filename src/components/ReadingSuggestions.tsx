
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, Plus } from 'lucide-react';
import { Book, useBooks } from '../hooks/useBooks';
import { useGemini, BookSuggestion } from '../hooks/useGemini';

interface ReadingSuggestionsProps {
  completedBook: Book;
}

export default function ReadingSuggestions({ completedBook }: ReadingSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { getReadingSuggestions } = useGemini();
  const { addBook } = useBooks();

  useEffect(() => {
    loadSuggestions();
  }, [completedBook]);

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
  };

  if (loading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6 text-center">
          <Sparkles className="mx-auto mb-2 animate-pulse" size={24} />
          <p className="text-sm text-gray-600">Buscando sugestões de leitura...</p>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
          <Sparkles className="mr-2" size={20} />
          Sugestões de Próximas Leituras
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {suggestion.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  por {suggestion.author}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => handleAddSuggestion(suggestion)}
                className="ml-2"
              >
                <Plus size={14} className="mr-1" />
                Adicionar
              </Button>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 {suggestion.reason}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
