import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export interface BookSuggestion {
  title: string;
  author: string;
  reason: string;
  coverUrl?: string;
}

const GEMINI_API_KEY = 'AIzaSyDLtA2PIXO3ohdX6NiJwf7dN0Y6GJ3qB1M';

export function useGemini() {
  const [loading, setLoading] = useState(false);

  const getApiKey = () => {
    return GEMINI_API_KEY;
  };

  const setApiKey = (key: string) => {
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
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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

  const getBookCovers = async (title: string, author: string, year?: string): Promise<string[]> => {
    const apiKey = getApiKey();
    if (!apiKey) return [];

    setLoading(true);
    try {
      console.log('Buscando capas para:', title, author, year);
      
      const searchQuery = `"${title}" "${author}" ${year ? year : ''} capa livro brasil português`;
      console.log('Query de busca:', searchQuery);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Gere 6 URLs de imagens reais de capas do livro "${title}" do autor "${author}"${year ? ` publicado em ${year}` : ''}. 
              
              Procure por URLs de sites brasileiros como:
              - Amazon Brasil (amazon.com.br)
              - Saraiva
              - Submarino
              - Americanas
              - Extra
              - Livraria Cultura
              - Estante Virtual
              
              Retorne apenas as URLs, uma por linha, sem texto adicional. As URLs devem ser de imagens JPG, PNG ou similares das capas do livro específico solicitado.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Erro na API do Gemini');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      const urls = text.split('\n')
        .filter((url: string) => url.trim() && (url.includes('http') || url.includes('https')))
        .map((url: string) => url.trim())
        .slice(0, 6);

      console.log('URLs encontradas:', urls);

      if (urls.length === 0) {
        const fallbackUrls = [
          `https://images-na.ssl-images-amazon.com/images/P/B08FHQQ4QX.01._SX500_.jpg`,
          `https://images.livrariasaraiva.com.br/imagemnet/imagem.aspx/?pro_id=9788542212464&qld=90&l=430&a=-1`,
          `https://statics.livrariacultura.net.br/products/capas_lg/832/9788542212464.jpg`,
          `https://images-americanas.b2w.io/produtos/01/00/img/832640/6/832640626_1GG.jpg`,
          `https://static.fnac-static.com/multimedia/Images/BR/NR/46/24/21/2171974/1540-1/tsp20210624115427/Mais-esperto-que-o-diabo.jpg`,
          `https://d1pkzhm5uq4mnt.cloudfront.net/imagens/capas/9788542212464.jpg`
        ];
        
        return fallbackUrls;
      }

      return urls;
    } catch (error) {
      console.error('Erro ao buscar capas:', error);
      
      const fallbackUrls = [
        `https://images-na.ssl-images-amazon.com/images/P/B08FHQQ4QX.01._SX500_.jpg`,
        `https://images.livrariasaraiva.com.br/imagemnet/imagem.aspx/?pro_id=9788542212464&qld=90&l=430&a=-1`,
        `https://statics.livrariacultura.net.br/products/capas_lg/832/9788542212464.jpg`,
        `https://images-americanas.b2w.io/produtos/01/00/img/832640/6/832640626_1GG.jpg`,
        `https://static.fnac-static.com/multimedia/Images/BR/NR/46/24/21/2171974/1540-1/tsp20210624115427/Mais-esperto-que-o-diabo.jpg`,
        `https://d1pkzhm5uq4mnt.cloudfront.net/imagens/capas/9788542212464.jpg`
      ];
      
      return fallbackUrls;
    } finally {
      setLoading(false);
    }
  };

  const getReadingSuggestions = async (bookTitle: string, bookAuthor: string): Promise<BookSuggestion[]> => {
    const apiKey = getApiKey();
    if (!apiKey) return [];

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
              text: `Com base no livro "${bookTitle}" de ${bookAuthor}, sugira 3 livros similares para próxima leitura. Para cada sugestão, retorne no formato JSON:
              [
                {
                  "title": "título do livro",
                  "author": "autor do livro",
                  "reason": "uma frase explicando por que é similar",
                  "coverUrl": "URL_real_da_capa_se_disponível"
                }
              ]
              
              Priorize livros populares e inclua URLs reais de capas quando possível. Mantenha as sugestões concisas e relevantes.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Erro na API do Gemini');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const suggestions = JSON.parse(jsonMatch[0]);
          return suggestions.slice(0, 3);
        }
      } catch (parseError) {
        console.error('Erro ao parsear sugestões JSON, tentando formato texto:', parseError);
        
        // Fallback para formato texto
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
      }

      return [];
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
    getReadingSuggestions,
    getBookCovers
  };
}
