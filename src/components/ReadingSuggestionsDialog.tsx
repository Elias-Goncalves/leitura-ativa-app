
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Loader2, BookOpen, ExternalLink } from 'lucide-react';
import { useGemini, BookSuggestion } from '../hooks/useGemini';

interface ReadingSuggestionsDialogProps {
  completedBook: any;
}

export default function ReadingSuggestionsDialog({ completedBook }: ReadingSuggestionsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { getReadingSuggestions } = useGemini();

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const results = await getReadingSuggestions(completedBook.name, completedBook.author);
      setSuggestions(results);
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && suggestions.length === 0) {
      loadSuggestions();
    }
  }, [isOpen]);

  const searchBookOnline = (title: string, author: string) => {
    const query = `${title} ${author} livro`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="default">
          <Lightbulb className="mr-2" size={16} />
          Sugestões de Leitura
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Lightbulb className="mr-2" size={20} />
            Sugestões de Leitura
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Baseado na sua leitura de "{completedBook.name}"
          </p>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin mr-2" size={24} />
            <span>Buscando sugestões personalizadas...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      {suggestion.coverUrl ? (
                        <img
                          src={suggestion.coverUrl}
                          alt={suggestion.title}
                          className="w-20 h-30 object-cover rounded flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-20 h-30 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                          <BookOpen size={24} className="text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{suggestion.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{suggestion.author}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{suggestion.reason}</p>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => searchBookOnline(suggestion.title, suggestion.author)}
                          className="flex items-center"
                        >
                          <ExternalLink size={14} className="mr-2" />
                          Buscar Online
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Não foi possível carregar sugestões no momento.</p>
                <Button onClick={loadSuggestions} className="mt-4" variant="outline">
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
