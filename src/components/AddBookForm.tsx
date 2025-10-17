import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Key, Sparkles, Search, Image } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import { useGemini } from '../hooks/useGemini';
import { toast } from '@/hooks/use-toast';
import GeminiApiConfig from './GeminiApiConfig';
import DatePicker from './DatePicker';
import BookSearchDialog from './BookSearchDialog';
import CoverSelector from './CoverSelector';

interface AddBookFormProps {
  onClose: () => void;
  prefilledData?: {
    name?: string;
    author?: string;
    year?: string;
    totalPages?: string;
    coverImageUrl?: string;
  };
}

export default function AddBookForm({ onClose, prefilledData }: AddBookFormProps) {
  const [formData, setFormData] = useState({
    name: prefilledData?.name || '',
    author: prefilledData?.author || '',
    year: prefilledData?.year || '',
    totalPages: prefilledData?.totalPages || '',
    startDate: new Date(),
    targetEndDate: undefined as Date | undefined,
    coverImageUrl: prefilledData?.coverImageUrl || ''
  });

  const [showApiConfig, setShowApiConfig] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showBookSearch, setShowBookSearch] = useState(false);
  const [showCoverSelector, setShowCoverSelector] = useState(false);
  const [dateError, setDateError] = useState('');
  const [autoCompleteEnabled, setAutoCompleteEnabled] = useState(true);
  const isSelectingSuggestion = useRef(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const { addBook } = useBooks();
  const { autocompleteBook, getApiKey, loading } = useGemini();

  useEffect(() => {
    const searchBooks = async () => {
      if (isSelectingSuggestion.current) {
        isSelectingSuggestion.current = false;
        return;
      }

      if (autoCompleteEnabled && formData.name.length >= 3) {
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
  }, [formData.name, autoCompleteEnabled]);

  // Validação de datas
  useEffect(() => {
    if (formData.startDate && formData.targetEndDate) {
      if (formData.startDate > formData.targetEndDate) {
        setDateError('A data de início não pode ser maior que a data de conclusão');
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }
  }, [formData.startDate, formData.targetEndDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.author || !formData.totalPages || !formData.targetEndDate) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (dateError) {
      toast({
        title: "Erro",
        description: dateError,
        variant: "destructive"
      });
      return;
    }

    await addBook({
      name: formData.name,
      author: formData.author,
      year: formData.year ? parseInt(formData.year) : undefined,
      totalPages: parseInt(formData.totalPages),
      startDate: formData.startDate,
      targetEndDate: formData.targetEndDate,
      coverImageUrl: formData.coverImageUrl || undefined
    });

    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: 'startDate' | 'targetEndDate', date: Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const selectSuggestion = (suggestion: string) => {
    isSelectingSuggestion.current = true;
    setFormData(prev => ({ ...prev, name: suggestion }));
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      setShowSuggestions(false);
    }
  };

  const handleCoverSelect = (url: string) => {
    setFormData(prev => ({ ...prev, coverImageUrl: url }));
  };

  if (showApiConfig) {
    return <GeminiApiConfig onClose={() => setShowApiConfig(false)} />;
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Plus className="mr-2" size={20} />
            Adicionar Novo Livro
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowBookSearch(true)}
              title="Buscar livros online"
            >
              <Search size={16} />
            </Button>
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
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Honeypot para desativar autocomplete do Chrome */}
            <input
              type="text"
              name="fake_name"
              autoComplete="new-password"
              style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, opacity: 0 }}
              aria-hidden="true"
              tabIndex={-1}
            />
            
            <div className="relative">
              <Label htmlFor="name">Nome do Livro *</Label>
              <div className="relative">
                <Input
                  ref={nameInputRef}
                  id="name"
                  name="bookTitle"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  onFocus={() => {
                    if (autoCompleteEnabled && suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  required
                  className={getApiKey() ? "pr-8" : ""}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                />
                {getApiKey() && loading && (
                  <Sparkles className="absolute right-2 top-1/2 transform -translate-y-1/2 animate-pulse text-blue-500" size={16} />
                )}
              </div>
              
              {getApiKey() && (
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    id="autocomplete"
                    checked={autoCompleteEnabled}
                    onChange={(e) => {
                      setAutoCompleteEnabled(e.target.checked);
                      if (!e.target.checked) {
                        setShowSuggestions(false);
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="autocomplete" className="text-sm text-gray-600 dark:text-gray-400">
                    Ativar autocompletar
                  </label>
                </div>
              )}
              
              {showSuggestions && autoCompleteEnabled && (
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
              <Label>Data de Início *</Label>
              <DatePicker
                date={formData.startDate}
                onDateSelect={(date) => handleDateChange('startDate', date || new Date())}
                placeholder="Selecione a data de início"
              />
            </div>
            
            <div>
              <Label>Data Meta para Conclusão *</Label>
              <DatePicker
                date={formData.targetEndDate}
                onDateSelect={(date) => handleDateChange('targetEndDate', date)}
                placeholder="Selecione a data meta"
                disabled={(date) => formData.startDate && date < formData.startDate}
              />
              {dateError && (
                <p className="text-sm text-red-500 mt-1">{dateError}</p>
              )}
            </div>
            
            <div>
              <Label>Capa do Livro</Label>
              <div className="flex space-x-2">
                <Input
                  type="url"
                  value={formData.coverImageUrl}
                  onChange={(e) => handleChange('coverImageUrl', e.target.value)}
                  placeholder="Cole a URL da capa aqui"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCoverSelector(true)}
                  title="Buscar capas online"
                  disabled={!formData.name || !formData.author}
                >
                  <Image size={16} />
                </Button>
              </div>
              {formData.coverImageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.coverImageUrl}
                    alt="Preview da capa"
                    className="w-16 h-24 object-cover rounded"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      toast({
                        title: "Erro ao carregar preview",
                        description: "A imagem não pôde ser carregada. Tente outra URL.",
                        variant: "destructive"
                      });
                    }}
                  />
                </div>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={!!dateError}>
              Adicionar Livro
            </Button>
          </form>
        </CardContent>
      </Card>

      <BookSearchDialog
        isOpen={showBookSearch}
        onClose={() => setShowBookSearch(false)}
      />

      <CoverSelector
        isOpen={showCoverSelector}
        onClose={() => setShowCoverSelector(false)}
        bookTitle={formData.name}
        author={formData.author}
        year={formData.year}
        onCoverSelect={handleCoverSelect}
      />
    </>
  );
}
