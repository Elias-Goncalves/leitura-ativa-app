
import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, Loader, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export default function AuthScreen() {
  const { login, signup } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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

    if (!isLoginMode) {
      if (!firstName || !lastName) {
        setError('Por favor, preencha seu nome e sobrenome.');
        setLoading(false);
        return;
      }

      if (firstName.length < 2 || lastName.length < 2) {
        setError('Nome e sobrenome devem ter pelo menos 2 caracteres.');
        setLoading(false);
        return;
      }

      if (!/^[A-Za-zÀ-ÖØ-öø-ÿ'\- ]+$/.test(firstName) || !/^[A-Za-zÀ-ÖØ-öø-ÿ'\- ]+$/.test(lastName)) {
        setError('Nome e sobrenome contêm caracteres inválidos.');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await signup(email, password, firstName, lastName);
        toast({
          title: `Bem-vindo(a), ${firstName}!`,
          description: 'Sua conta foi criada com sucesso.',
        });
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
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciais inválidas. Verifique seu e-mail e senha.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md border border-border">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <LogIn className="text-primary" size={40} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {isLoginMode ? 'Bem-vindo de Volta!' : 'Crie sua Conta'}
          </h2>
          <p className="text-muted-foreground">
            {isLoginMode ? 'Acesse sua conta para continuar.' : 'Junte-se ao Leitura Ativa!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {!isLoginMode && (
            <>
              <div>
                <Label htmlFor="firstName">Nome *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Seu nome"
                    className="pl-10"
                    autoComplete="off"
                    required={!isLoginMode}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="lastName">Sobrenome *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Seu sobrenome"
                    className="pl-10"
                    autoComplete="off"
                    required={!isLoginMode}
                  />
                </div>
              </div>
            </>
          )}

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
                autoComplete="off"
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
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
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

        <p className="mt-6 text-center text-muted-foreground text-sm">
          {isLoginMode ? (
            <>
              Não tem uma conta?{' '}
              <button
                onClick={() => {
                  setIsLoginMode(false);
                  setError('');
                  setFirstName('');
                  setLastName('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-primary font-semibold hover:underline focus:outline-none transition-colors"
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
                  setFirstName('');
                  setLastName('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-primary font-semibold hover:underline focus:outline-none transition-colors"
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
