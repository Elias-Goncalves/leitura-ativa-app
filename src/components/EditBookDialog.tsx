
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Book, useBooks } from '../hooks/useBooks';
import { toast } from '@/hooks/use-toast';
import DatePicker from './DatePicker';

interface EditBookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
}

export default function EditBookDialog({ isOpen, onClose, book }: EditBookDialogProps) {
  const [formData, setFormData] = useState({
    name: book.name,
    author: book.author,
    year: book.year?.toString() || '',
    totalPages: book.totalPages.toString(),
    startDate: book.startDate.toDate ? book.startDate.toDate() : new Date(book.startDate),
    targetEndDate: book.targetEndDate.toDate ? book.targetEndDate.toDate() : new Date(book.targetEndDate),
    coverImageUrl: book.coverImageUrl || ''
  });

  const { updateBook } = useBooks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateBook(book.id, {
        name: formData.name,
        author: formData.author,
        year: formData.year ? parseInt(formData.year) : undefined,
        totalPages: parseInt(formData.totalPages),
        startDate: formData.startDate,
        targetEndDate: formData.targetEndDate,
        coverImageUrl: formData.coverImageUrl
      });

      toast({
        title: "Livro atualizado!",
        description: "As informações do livro foram atualizadas."
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o livro.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Livro</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Livro *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="author">Autor *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="year">Ano de Publicação</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="totalPages">Total de Páginas *</Label>
            <Input
              id="totalPages"
              type="number"
              value={formData.totalPages}
              onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
              required
              min="1"
            />
          </div>

          <div>
            <Label>Data de Início *</Label>
            <DatePicker
              date={formData.startDate}
              onDateSelect={(date) => date && setFormData({ ...formData, startDate: date })}
            />
          </div>

          <div>
            <Label>Data Meta para Conclusão *</Label>
            <DatePicker
              date={formData.targetEndDate}
              onDateSelect={(date) => date && setFormData({ ...formData, targetEndDate: date })}
            />
          </div>

          <div>
            <Label htmlFor="coverImageUrl">URL da Capa</Label>
            <Input
              id="coverImageUrl"
              type="url"
              value={formData.coverImageUrl}
              onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
