
# 🔧 Guia de Solução de Problemas - Firebase Authentication

## ❌ Problema: Erro ao criar conta/fazer login

## 📋 Passo a Passo de Verificação

### 1️⃣ **Verificar se o Authentication está ATIVADO**
1. Acesse o [Console do Firebase](https://console.firebase.google.com)
2. Selecione seu projeto "leitura-de-livros"
3. No menu lateral, clique em **"Authentication"**
4. Clique na aba **"Sign-in method"**
5. Procure por **"Email/Password"** na lista
6. Se estiver **desabilitado**, clique nele e **ATIVE**
7. Salve as alterações

### 2️⃣ **Verificar as Chaves do Firebase**
1. No Console do Firebase, vá em **"Configurações do projeto"** (ícone de engrenagem)
2. Role para baixo até **"Seus aplicativos"**
3. Clique no ícone **"Web"** (</>) 
4. Copie TODAS as informações que aparecem
5. Compare com o arquivo `src/config/firebase.ts`

### 3️⃣ **Verificar Domínios Autorizados**
1. No Console do Firebase, vá em **"Authentication"**
2. Clique na aba **"Settings"**
3. Role até **"Authorized domains"**
4. Adicione estes domínios se não estiverem:
   - `localhost`
   - `127.0.0.1`
   - `lovable.app` (para o preview)
   - Seu domínio personalizado (se tiver)

### 4️⃣ **Verificar Regras do Firestore**
1. No Console do Firebase, vá em **"Firestore Database"**
2. Clique na aba **"Rules"**
3. Cole estas regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acesso aos dados do usuário logado
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Permitir acesso aos livros do usuário
      match /books/{bookId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

4. Clique em **"Publish"**

### 5️⃣ **Verificar se o Firestore está CRIADO**
1. No Console do Firebase, vá em **"Firestore Database"**
2. Se aparecer "Create database", clique e crie
3. Escolha **"Start in test mode"** (por enquanto)
4. Escolha uma localização próxima (como `southamerica-east1`)

## 🚨 Erros Comuns e Soluções

### Erro: "API key not valid"
**Solução:** Suas chaves do Firebase estão incorretas
- Vá ao passo 2️⃣ acima e substitua TODAS as chaves

### Erro: "Project not found"
**Solução:** O ID do projeto está errado
- Verifique se `projectId` no firebase.ts está igual ao ID no Console

### Erro: "Auth domain not authorized"
**Solução:** Domínio não autorizado
- Vá ao passo 3️⃣ e adicione os domínios necessários

### Erro: "Operation not allowed"
**Solução:** Authentication não está ativado
- Vá ao passo 1️⃣ e ative Email/Password

## ✅ Como Testar se Está Funcionando

1. Abra o aplicativo
2. Tente criar uma conta com email e senha
3. Se funcionar, tente fazer logout e login novamente
4. Verifique se consegue adicionar um livro

## 📞 Ainda com Problemas?

Se seguiu todos os passos e ainda não funciona:
1. Abra o console do navegador (F12)
2. Vá na aba "Console"
3. Tente fazer login/cadastro
4. Copie a mensagem de erro que aparecer
5. Me envie essa mensagem para ajudar melhor

## 🔄 Reiniciar Tudo (Última Opção)

Se nada funcionar:
1. Crie um NOVO projeto no Firebase
2. Substitua TODAS as configurações
3. Refaça os passos de 1️⃣ a 5️⃣
