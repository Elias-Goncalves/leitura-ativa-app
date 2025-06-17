
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';

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

  const { addBook } = useBooks();

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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Plus className="mr-2" size={20} />
          Adicionar Novo Livro
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={20} />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Livro *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
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
