import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export interface BookSuggestion {
  title: string;
  author: string;
  reason: string;
}

const GEMINI_API_KEY = 'AIzaSyDLtA2PIXO3ohdX6NiJwf7dN0Y6GJ3qB1M';

export function useGemini() {
  const [loading, setLoading] = useState(false);

  const getApiKey = () => {
    return GEMINI_API_KEY;
  };

  const setApiKey = (key: string) => {
    // API key is now hardcoded, but we keep this function for compatibility
    localStorage.setItem('gemini_api_key', key);
  };

  const autocompleteBook = async (partialTitle: string): Promise<string[]> => {
    const apiKey = getApiKey();
    if (!apiKey) {
      toast({
        title: "Chave da API necessária",
        description: "Configure sua chave da API do Gemini para usar o autocompletar.",
        variant: "destructive"
      });
      return [];
    }

    if (partialTitle.length < 3) return [];

    setLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Complete os títulos de livros que começam com "${partialTitle}". Retorne apenas 5 títulos completos, um por linha, sem numeração ou formatação adicional. Apenas os títulos dos livros.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Erro na API do Gemini');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return text.split('\n')
        .filter((title: string) => title.trim())
        .slice(0, 5);
    } catch (error) {
      console.error('Erro no autocompletar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar sugestões de títulos.",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getReadingSuggestions = async (bookTitle: string, bookAuthor: string): Promise<BookSuggestion[]> => {
    const apiKey = getApiKey();
    if (!apiKey) return [];

    setLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Com base no livro "${bookTitle}" de ${bookAuthor}, sugira 3 livros similares para próxima leitura. Para cada sugestão, retorne no formato:
TÍTULO: [título do livro]
AUTOR: [autor do livro]
MOTIVO: [uma frase explicando por que é similar]
---

Mantenha as sugestões concisas e relevantes.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Erro na API do Gemini');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      const suggestions = text.split('---')
        .filter((block: string) => block.trim())
        .slice(0, 3)
        .map((block: string) => {
          const lines = block.trim().split('\n');
          const title = lines.find((line: string) => line.startsWith('TÍTULO:'))?.replace('TÍTULO:', '').trim() || '';
          const author = lines.find((line: string) => line.startsWith('AUTOR:'))?.replace('AUTOR:', '').trim() || '';
          const reason = lines.find((line: string) => line.startsWith('MOTIVO:'))?.replace('MOTIVO:', '').trim() || '';
          
          return { title, author, reason };
        })
        .filter((suggestion: BookSuggestion) => suggestion.title && suggestion.author);

      return suggestions;
    } catch (error) {
      console.error('Erro nas sugestões:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getApiKey,
    setApiKey,
    autocompleteBook,
    getReadingSuggestions
  };
}
