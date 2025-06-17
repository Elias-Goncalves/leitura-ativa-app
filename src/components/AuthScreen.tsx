
import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AuthScreen() {
  const { login, signup } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor, preencha o e-mail e a senha.');
      setLoading(false);
      return;
    }

    if (!isLoginMode && password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (error: any) {
      let errorMessage = 'Erro na autenticação. Tente novamente.';
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Endereço de e-mail inválido.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Sua conta foi desativada.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'E-mail ou senha incorretos.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {isLoginMode ? 'Bem-vindo de Volta!' : 'Crie sua Conta'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {isLoginMode ? 'Acesse sua conta para continuar.' : 'Junte-se ao Leitura Ativa!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="pl-10"
                required
              />
            </div>
          </div>

          {!isLoginMode && (
            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin mr-2" size={20} />
            ) : isLoginMode ? (
              <LogIn className="mr-2" size={20} />
            ) : (
              <UserPlus className="mr-2" size={20} />
            )}
            {isLoginMode ? 'Entrar' : 'Criar Conta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-300 text-sm">
          {isLoginMode ? (
            <>
              Não tem uma conta?{' '}
              <button
                onClick={() => {
                  setIsLoginMode(false);
                  setError('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-blue-600 hover:underline focus:outline-none"
              >
                Crie uma aqui!
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{' '}
              <button
                onClick={() => {
                  setIsLoginMode(true);
                  setError('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-blue-600 hover:underline focus:outline-none"
              >
                Faça Login!
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
