
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Check, ImageOff, RefreshCw } from 'lucide-react';

interface CoverSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  author: string;
  year?: string;
  onCoverSelect: (url: string) => void;
}

export default function CoverSelector({ 
  isOpen, 
  onClose, 
  bookTitle, 
  author, 
  year, 
  onCoverSelect 
}: CoverSelectorProps) {
  const [covers, setCovers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCover, setSelectedCover] = useState<string>('');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && bookTitle && author) {
      searchCovers();
    }
  }, [isOpen, bookTitle, author, year]);

  const searchCovers = async () => {
    setLoading(true);
    setFailedImages(new Set());
    setSelectedCover('');
    
    try {
      const searchQuery = encodeURIComponent(`${bookTitle} ${author} book cover`);
      const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const googleCseId = import.meta.env.VITE_GOOGLE_CSE_ID;
      
      if (googleApiKey && googleCseId) {
        const response = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCseId}&q=${searchQuery}&searchType=image&num=6`
        );
        
        if (response.ok) {
          const data = await response.json();
          const imageUrls = data.items?.map((item: any) => item.link) || [];
          setCovers(imageUrls);
        } else {
          console.warn('Google API error, usando fallback');
          setCovers([]);
        }
      } else {
        // Fallback: busca simulada com URLs genéricas
        const sampleCovers = [
          `https://covers.openlibrary.org/b/isbn/9780000000000-L.jpg?default=false`,
        ];
        setCovers(sampleCovers);
      }
    } catch (error) {
      console.error('Erro ao buscar capas:', error);
      setCovers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCover = () => {
    if (selectedCover) {
      onCoverSelect(selectedCover);
      onClose();
    }
  };

  const handleImageError = (url: string) => {
    setFailedImages(prev => new Set([...prev, url]));
  };

  const validCovers = covers.filter(cover => !failedImages.has(cover));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Selecionar Capa do Livro</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={searchCovers}
              disabled={loading}
              title="Buscar novamente"
            >
              <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
            </Button>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Buscando por: "{bookTitle}" - {author} {year && `(${year})`}
          </p>
          {!import.meta.env.VITE_GOOGLE_API_KEY && (
            <div className="bg-accent/10 border border-accent/20 text-accent px-3 py-2 rounded-lg text-xs mt-2">
              <strong>Modo Fallback:</strong> Configure VITE_GOOGLE_API_KEY e VITE_GOOGLE_CSE_ID para buscar capas reais do Google.
            </div>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin mr-2" size={24} />
            <span>Buscando capas...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {covers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {covers.map((cover, index) => (
                  <Card 
                    key={`${cover}-${index}`}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedCover === cover ? 'ring-2 ring-primary shadow-lg' : ''
                    } ${failedImages.has(cover) ? 'opacity-50' : ''}`}
                    onClick={() => !failedImages.has(cover) && setSelectedCover(cover)}
                  >
                    <CardContent className="p-2">
                      <div className="relative">
                        {!failedImages.has(cover) ? (
                          <div className="relative">
                            <img
                              src={cover}
                              alt={`Capa ${index + 1} - ${bookTitle}`}
                              className="w-full h-40 object-cover rounded"
                              onError={() => handleImageError(cover)}
                              crossOrigin="anonymous"
                              loading="lazy"
                            />
                            {selectedCover === cover && (
                              <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                                <Check size={16} />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-40 bg-muted rounded flex items-center justify-center">
                            <div className="text-center">
                              <ImageOff size={24} className="text-muted-foreground mx-auto mb-2" />
                              <p className="text-xs text-muted-foreground">Falha ao carregar</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ImageOff size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhuma capa encontrada.</p>
                <p className="text-sm text-muted-foreground mt-2">Tente buscar novamente ou insira uma URL manualmente no formulário.</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
              <p className="text-xs text-muted-foreground">
                {covers.length > 0 && `${validCovers.length} de ${covers.length} imagens válidas`}
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSelectCover}
                  disabled={!selectedCover || failedImages.has(selectedCover)}
                  className="shadow-md"
                >
                  Selecionar Capa
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
