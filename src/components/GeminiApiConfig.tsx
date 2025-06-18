
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Eye, EyeOff } from 'lucide-react';
import { useGemini } from '../hooks/useGemini';
import { toast } from '@/hooks/use-toast';

interface GeminiApiConfigProps {
  onClose: () => void;
}

export default function GeminiApiConfig({ onClose }: GeminiApiConfigProps) {
  const { getApiKey, setApiKey } = useGemini();
  const [apiKey, setApiKeyInput] = useState(getApiKey() || '');
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma chave da API válida.",
        variant: "destructive"
      });
      return;
    }

    setApiKey(apiKey.trim());
    toast({
      title: "Sucesso!",
      description: "Chave da API do Gemini configurada com sucesso."
    });
    onClose();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="mr-2" size={20} />
          Configurar API do Gemini
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">Chave da API do Gemini</Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Insira sua chave da API do Gemini"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Para obter sua chave da API:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Acesse <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google AI Studio</a></li>
            <li>Crie uma nova chave da API</li>
            <li>Cole a chave aqui</li>
          </ol>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleSave} className="flex-1">
            Salvar
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
