
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Check, ImageOff } from 'lucide-react';
import { useGemini } from '../hooks/useGemini';

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
  const { getBookCovers } = useGemini();

  useEffect(() => {
    if (isOpen && bookTitle && author) {
      searchCovers();
    }
  }, [isOpen, bookTitle, author, year]);

  const searchCovers = async () => {
    setLoading(true);
    setFailedImages(new Set());
    try {
      const results = await getBookCovers(bookTitle, author, year);
      console.log('Capas encontradas:', results);
      setCovers(results);
    } catch (error) {
      console.error('Erro ao buscar capas:', error);
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
    console.log('Erro ao carregar imagem:', url);
    setFailedImages(prev => new Set([...prev, url]));
  };

  const validCovers = covers.filter(cover => !failedImages.has(cover));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar Capa do Livro</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin mr-2" size={24} />
            <span>Buscando capas...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {covers.map((cover, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all ${
                    selectedCover === cover ? 'ring-2 ring-blue-500' : ''
                  } ${failedImages.has(cover) ? 'opacity-50' : ''}`}
                  onClick={() => !failedImages.has(cover) && setSelectedCover(cover)}
                >
                  <CardContent className="p-2">
                    <div className="relative">
                      {!failedImages.has(cover) ? (
                        <img
                          src={cover}
                          alt={`Capa ${index + 1}`}
                          className="w-full h-40 object-cover rounded"
                          onError={() => handleImageError(cover)}
                          onLoad={() => console.log('Imagem carregada:', cover)}
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                          <ImageOff size={32} className="text-gray-400" />
                        </div>
                      )}
                      {selectedCover === cover && !failedImages.has(cover) && (
                        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {validCovers.length === 0 && !loading && (
              <p className="text-center text-gray-500 py-8">
                Nenhuma capa encontrada ou todas falharam ao carregar. Você pode inserir uma URL manualmente.
              </p>
            )}

            <div className="flex justify-end space-x-2">
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
        )}
      </DialogContent>
    </Dialog>
  );
}
