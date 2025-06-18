
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Key, Sparkles } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import { useGemini } from '../hooks/useGemini';
import GeminiApiConfig from './GeminiApiConfig';

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

  const [showApiConfig, setShowApiConfig] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { addBook } = useBooks();
  const { autocompleteBook, getApiKey, loading } = useGemini();

  useEffect(() => {
    const searchBooks = async () => {
      if (formData.name.length >= 3) {
        const results = await autocompleteBook(formData.name);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(searchBooks, 300);
    return () => clearTimeout(timeoutId);
  }, [formData.name]);

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

  const selectSuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, name: suggestion }));
    setShowSuggestions(false);
  };

  if (showApiConfig) {
    return <GeminiApiConfig onClose={() => setShowApiConfig(false)} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Plus className="mr-2" size={20} />
          Adicionar Novo Livro
        </CardTitle>
        <div className="flex items-center space-x-2">
          {!getApiKey() && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowApiConfig(true)}
              title="Configurar API do Gemini para autocompletar"
            >
              <Key size={16} />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Label htmlFor="name">Nome do Livro *</Label>
            <div className="relative">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className={getApiKey() ? "pr-8" : ""}
              />
              {getApiKey() && loading && (
                <Sparkles className="absolute right-2 top-1/2 transform -translate-y-1/2 animate-pulse text-blue-500" size={16} />
              )}
            </div>
            
            {showSuggestions && (
              <div className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md mt-1 shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md"
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
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
