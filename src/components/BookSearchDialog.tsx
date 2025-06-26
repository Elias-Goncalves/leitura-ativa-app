
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Loader2, BookOpen } from 'lucide-react';
import { useGemini } from '../hooks/useGemini';
import { useBooks } from '../hooks/useBooks';
import { toast } from '@/hooks/use-toast';

interface BookSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookResult {
  title: string;
  author: string;
  year?: number;
  pages?: number;
  coverUrl?: string;
  description?: string;
}

export default function BookSearchDialog({ isOpen, onClose }: BookSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { getApiKey } = useGemini();
  const { addBook } = useBooks();

  const searchBooks = async () => {
    if (!searchTerm.trim()) return;
    
    const apiKey = getApiKey();
    if (!apiKey) return;

    setLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Busque informações sobre livros relacionados a "${searchTerm}". Retorne exatamente 5 livros no formato JSON:
              [
                {
                  "title": "Título completo do livro",
                  "author": "Nome completo do autor",
                  "year": 2023,
                  "pages": 250,
                  "coverUrl": "URL_real_da_capa_se_disponível",
                  "description": "Breve descrição do livro"
                }
              ]
              
              Priorize livros populares e bem conhecidos. Use apenas URLs reais de capas quando disponível.`
            }]
          }]
        })
      });

      if (!response.ok) throw new Error('Erro na busca');

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const results = JSON.parse(jsonMatch[0]);
          setBooks(results);
        }
      } catch (parseError) {
        console.error('Erro ao parsear resultados:', parseError);
        setBooks([]);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = async (book: BookResult) => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    try {
      await addBook({
        name: book.title,
        author: book.author,
        year: book.year,
        totalPages: book.pages || 300,
        startDate: today,
        targetEndDate: nextMonth,
        coverImageUrl: book.coverUrl || ''
      });

      toast({
        title: "Livro adicionado!",
        description: `"${book.title}" foi adicionado à sua biblioteca.`
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o livro.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buscar Livros Online</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome do livro ou autor..."
              onKeyDown={(e) => e.key === 'Enter' && searchBooks()}
            />
            <Button onClick={searchBooks} disabled={loading || !searchTerm.trim()}>
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
            </Button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin mr-2" size={24} />
              <span>Buscando livros...</span>
            </div>
          )}

          {books.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {books.map((book, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSelectBook(book)}
                >
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-24 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                          <BookOpen size={20} className="text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1">{book.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{book.author}</p>
                        {book.year && (
                          <p className="text-xs text-gray-500">{book.year}</p>
                        )}
                        {book.pages && (
                          <p className="text-xs text-gray-500">{book.pages} páginas</p>
                        )}
                        {book.description && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{book.description}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && books.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum livro encontrado para "{searchTerm}"</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
