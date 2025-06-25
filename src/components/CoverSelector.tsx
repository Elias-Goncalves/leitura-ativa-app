
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Check } from 'lucide-react';
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
  const { getBookCovers } = useGemini();

  useEffect(() => {
    if (isOpen && bookTitle && author) {
      searchCovers();
    }
  }, [isOpen, bookTitle, author, year]);

  const searchCovers = async () => {
    setLoading(true);
    try {
      const results = await getBookCovers(bookTitle, author, year);
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
                  }`}
                  onClick={() => setSelectedCover(cover)}
                >
                  <CardContent className="p-2">
                    <div className="relative">
                      <img
                        src={cover}
                        alt={`Capa ${index + 1}`}
                        className="w-full h-40 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {selectedCover === cover && (
                        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {covers.length === 0 && !loading && (
              <p className="text-center text-gray-500 py-8">
                Nenhuma capa encontrada. Verifique os dados do livro.
              </p>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSelectCover}
                disabled={!selectedCover}
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
