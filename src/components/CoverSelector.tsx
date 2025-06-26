
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
    
    // URLs genéricas de exemplo para capas de livros brasileiros
    const sampleCovers = [
      `https://images-na.ssl-images-amazon.com/images/P/8501110551.01.L.jpg`,
      `https://images-na.ssl-images-amazon.com/images/P/8579802709.01.L.jpg`,
      `https://images-na.ssl-images-amazon.com/images/P/8535930952.01.L.jpg`,
      `https://images-na.ssl-images-amazon.com/images/P/8542212460.01.L.jpg`,
      `https://images-na.ssl-images-amazon.com/images/P/8563321250.01.L.jpg`,
      `https://images-na.ssl-images-amazon.com/images/P/8550801488.01.L.jpg`
    ];
    
    // Simular busca
    setTimeout(() => {
      setCovers(sampleCovers);
      setLoading(false);
    }, 1000);
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
          <p className="text-sm text-gray-600">
            Buscando por: "{bookTitle}" - {author} {year && `(${year})`}
          </p>
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
                    className={`cursor-pointer transition-all ${
                      selectedCover === cover ? 'ring-2 ring-blue-500' : ''
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
                            />
                            {selectedCover === cover && (
                              <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                                <Check size={16} />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                            <div className="text-center">
                              <ImageOff size={24} className="text-gray-400 mx-auto mb-2" />
                              <p className="text-xs text-gray-500">Falha ao carregar</p>
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
                <p className="text-gray-500">Nenhuma capa encontrada.</p>
                <p className="text-sm text-gray-400 mt-2">Tente buscar novamente ou insira uma URL manualmente.</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <p className="text-xs text-gray-500">
                {covers.length > 0 && `${validCovers.length} de ${covers.length} imagens válidas`}
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSelectCover}
                  disabled={!selectedCover || failedImages.has(selectedCover)}
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
